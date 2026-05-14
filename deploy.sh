#!/usr/bin/env bash
# Deploy lemnArt admin + store to the production droplet.
#
# Scoped strictly to the lemnart docker compose project; does not touch
# other projects on the shared host (e.g. ken-v2, ken-website) or system
# services like nginx.
#
# Override target with env vars if needed:
#   DEPLOY_HOST=1.2.3.4 DEPLOY_PATH=/some/path ./deploy.sh

set -euo pipefail

HOST="${DEPLOY_HOST:-174.138.6.248}"
REMOTE_PATH="${DEPLOY_PATH:-/root/lemnart}"
COMPOSE_FILE="docker-compose.prod.yml"

echo "==> Deploying to $HOST:$REMOTE_PATH"

ssh "$HOST" bash -s <<EOF
set -euo pipefail
cd "$REMOTE_PATH"

echo "==> verify clean working tree (tracked files only)"
if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: $REMOTE_PATH has uncommitted changes to tracked files."
  echo "Refusing to deploy. Resolve on the server, then re-run."
  git status
  exit 1
fi

echo "==> git pull --ff-only"
git pull --ff-only

echo "==> docker compose build"
docker compose -f $COMPOSE_FILE build

echo "==> docker compose up -d"
docker compose -f $COMPOSE_FILE up -d

if [ -d admin/prisma/migrations ] && [ -n "\$(ls -A admin/prisma/migrations 2>/dev/null)" ]; then
  echo "==> prisma migrate deploy"
  # The admin runtime image is Next.js standalone and does not bundle
  # the prisma CLI, so pin the version to match the project to avoid
  # npx pulling an incompatible newer release.
  PRISMA_VERSION=\$(grep -oE '"prisma": "\\^?[0-9]+\\.[0-9]+\\.[0-9]+"' admin/package.json | head -1 | grep -oE '[0-9]+\\.[0-9]+\\.[0-9]+')
  docker compose -f $COMPOSE_FILE exec -T admin npx -y prisma@\$PRISMA_VERSION migrate deploy
else
  echo "==> skipping prisma migrate (no migrations directory; project uses 'prisma db push' for schema sync)"
fi

echo "==> status"
docker compose -f $COMPOSE_FILE ps
EOF

echo "==> done"
