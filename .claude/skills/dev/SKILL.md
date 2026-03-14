---
name: dev
description: Start the admin and store development servers
user_invocable: true
---

# Start Dev Environment

Start both the admin and store Next.js development servers for the lemnArt project.

## Prerequisites Check

Before starting, verify:

1. **Node modules installed:**
   - Check `admin/node_modules` exists; if not, run `cd /Users/cristian/Development/lemnArt/admin && npm install`
   - Check `store/node_modules` exists; if not, run `cd /Users/cristian/Development/lemnArt/store && npm install`

2. **Environment files present:**
   - Check `admin/.env` exists; warn the user if missing
   - Check `store/.env` exists; warn the user if missing

3. **Prisma client generated:**
   - Check `admin/node_modules/.prisma/client` exists; if not, run `cd /Users/cristian/Development/lemnArt/admin && npx prisma generate`

## Start Servers

Run both servers in the background:

```bash
cd /Users/cristian/Development/lemnArt/admin && npm run dev
```
(Admin runs on port 3001)

```bash
cd /Users/cristian/Development/lemnArt/store && npm run dev
```
(Store runs on port 3002)

Start each server using the Bash tool with `run_in_background: true` so both run concurrently.

## Notes

- Admin dashboard: `http://localhost:3001`
- Store frontend: `http://localhost:3002`
- If ports are already in use, check for existing processes with `lsof -i :3001` and `lsof -i :3002`.
