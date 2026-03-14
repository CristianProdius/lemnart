# lemnArt — E-Commerce Admin + Store

## Project Structure

- `admin/` — Next.js admin dashboard (port 3001)
- `store/` — Next.js storefront (port 3002)
- Prisma ORM with PostgreSQL
- Better Auth for authentication
- UI: shadcn/ui, TanStack Table, React Hook Form + Zod, react-hot-toast, axios

## Automatic Skill Usage

When working on this project, automatically use the following skills based on the task at hand. Do NOT wait for the user to invoke them — detect the intent and run the appropriate skill.

### When to use each skill:

- **`/scaffold-resource`** — When the user asks to "add a new resource", "create CRUD for X", "add X like sizes/colors", or wants a new entity with list/create/edit/delete. Run this instead of manually creating files one by one.

- **`/generate-api-route`** — When the user asks to "add an API route", "create an endpoint for X", or needs a new route under `admin/app/api/`. Use this to follow the auth pattern consistently.

- **`/scaffold-form`** — When the user asks to "create a form for X", "add a create/edit page", or needs a form component with validation. Use this to ensure React Hook Form + Zod + AlertModal patterns are followed.

- **`/scaffold-data-table`** — When the user asks to "add a list page", "create a table for X", "show all X", or needs columns + client + cell actions for a resource. Use this to match the TanStack Table pattern.

- **`/db-migrate`** — When Prisma schema changes are made (new model, field added/removed, relation changed). Automatically run this after any edit to `admin/prisma/schema.prisma`.

- **`/dev`** — When the user asks to "start the app", "run the project", "start dev servers", or "spin up the environment".

- **`/add-nav-link`** — When a new resource is scaffolded or the user asks to "add X to the navigation" or "add a nav link". Automatically run this after `/scaffold-resource`.

- **`/seed-db`** — When the user asks to "seed the database", "add test data", "populate with sample data", or "create fixtures".

### Chaining rules:

- After `/scaffold-resource`: automatically run `/add-nav-link` and `/db-migrate`
- After editing `schema.prisma`: automatically run `/db-migrate`
- When creating a new resource end-to-end: use `/scaffold-resource` → `/add-nav-link` → `/db-migrate` in sequence

## Code Conventions

- API routes use Better Auth: `auth.api.getSession({ headers: req.headers })`
- Store ownership check: `prismadb.store.findFirst({ where: { id: storeId, userId } })`
- Next.js params are `Promise`-based: `{ params }: { params: Promise<{ storeId: string }> }`
- Error logs use uppercase tags: `console.log('[RESOURCE_METHOD]', err)`
- Forms use `useForm` with `zodResolver`, `initialData` pattern for create/edit mode
- All resources belong to a Store via `storeId` foreign key with `@@index([storeId])`

## Git Workflow Rules

- **NEVER commit or push directly to `main`**. Always create a feature branch first.
- Branch naming: `feat/<short-description>`, `fix/<short-description>`, or `chore/<short-description>`
- After committing, push the branch and create a PR with `gh pr create`
- Do NOT merge PRs — the user will merge manually (Greptile runs on PRs for automated review)
- When creating a PR, include a clear summary and test plan in the PR body
