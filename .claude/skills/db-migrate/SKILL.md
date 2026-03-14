---
name: db-migrate
description: Run Prisma generate and push schema changes to the database
user_invocable: true
---

# Prisma Migration Helper

Run the Prisma migration workflow for the lemnArt admin project.

## Steps

1. **Generate Prisma Client** — Run from the `admin/` directory:
   ```bash
   cd /Users/cristian/Development/lemnArt/admin && npx prisma generate
   ```
   This regenerates the Prisma Client to reflect any schema changes.

2. **Push Schema to Database** — Apply schema changes:
   ```bash
   cd /Users/cristian/Development/lemnArt/admin && npx prisma db push
   ```
   This syncs the database schema with `prisma/schema.prisma` without creating migration files (suitable for prototyping).

3. **Verify** — After both commands succeed, suggest the user can inspect the database with:
   ```bash
   cd /Users/cristian/Development/lemnArt/admin && npx prisma studio
   ```

## Error Handling

- If `prisma generate` fails, check `admin/prisma/schema.prisma` for syntax errors.
- If `prisma db push` fails, it may be due to breaking changes (dropping columns with data). Report the error and suggest options: reset the database (`npx prisma db push --force-reset`) or manually handle the migration.
- Always run `generate` before `db push` to ensure the client is in sync.

## Notes

- The project uses PostgreSQL (`provider = "postgresql"`) with `relationMode = "prisma"`.
- The database URL is in `admin/.env` as `DATABASE_URL`.
