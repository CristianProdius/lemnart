---
name: generate-api-route
description: Generate a Next.js API route with auth and store ownership checks
user_invocable: true
arguments:
  - name: resource
    description: "Resource name in singular form (e.g. 'size', 'color')"
    required: true
  - name: type
    description: "Route type: 'collection' (POST+GET) or 'detail' (GET+PATCH+DELETE). Defaults to 'collection'"
    required: false
  - name: fields
    description: "Comma-separated field names for validation (e.g. 'name,value'). Defaults to 'name,value'"
    required: false
---

# Generate API Route

Generate a Next.js API route following the lemnArt admin auth and error-handling patterns.

## Inputs

- `$ARGUMENTS.resource` — singular resource name (e.g. `tag`)
- `$ARGUMENTS.type` — `collection` or `detail` (default: `collection`)
- `$ARGUMENTS.fields` — comma-separated field names (default: `name,value`)

## Auth Pattern

Every mutating endpoint (POST, PATCH, DELETE) must:

1. Get session: `const session = await auth.api.getSession({ headers: req.headers });`
2. Extract user: `const userId = session?.user?.id;`
3. Check auth: return 401 if no userId
4. Verify store ownership: `prismadb.store.findFirst({ where: { id: storeId, userId } })`
5. Return 403 if store not owned

GET endpoints on detail routes do NOT require auth. GET on collection routes do NOT require auth.

## Collection Route (`admin/app/api/[storeId]/<resources>/route.ts`)

```typescript
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId } = await params;

        const { /* fields */ } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        // Validate each field:
        // if (!fieldName) { return new NextResponse("FieldName is required", { status: 400}); }

        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.create({
            data: { /* ...fields, */ storeId: storeId }
        })

        return NextResponse.json(resource);

    } catch (err) {
        console.log(`[RESOURCES_POST] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        if (!storeId) {
            return new NextResponse("Store Id is required", { status: 400});
        }

        const resources = await prismadb.resource.findMany({
            where: { storeId: storeId }
        })

        return NextResponse.json(resources);

    } catch (err) {
        console.log(`[RESOURCES_GET] ${err}`);
        return new NextResponse(`Internal error`, { status: 500})
    }
}
```

## Detail Route (`admin/app/api/[storeId]/<resources>/[<resourceId>]/route.ts`)

```typescript
import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server"

export async function GET (
    req: Request,
    { params }: { params: Promise<{ resourceId: string }>}
) {
    try {
        const { resourceId } = await params;
        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const resource = await prismadb.resource.findUnique({
            where: { id: resourceId }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_GET]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function PATCH (
    req: Request,
    { params }: { params: Promise<{ storeId: string, resourceId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const body = await req.json();
        const { storeId, resourceId } = await params;

        const { /* fields */ } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        // Validate each field

        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.updateMany({
            where: { id: resourceId },
            data: { /* ...fields */ }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_PATCH]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}

export async function DELETE (
    req: Request,
    { params }: { params: Promise<{ storeId: string, resourceId: string }>}
) {
    try {
        const session = await auth.api.getSession({ headers: req.headers });
        const userId = session?.user?.id;
        const { storeId, resourceId } = await params;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 401 })
        }

        if(!resourceId) {
            return new NextResponse("Resource id is required", { status: 400 });
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: { id: storeId, userId }
        })

        if (!storeByUserId) {
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const resource = await prismadb.resource.deleteMany({
            where: { id: resourceId }
        })

        return NextResponse.json(resource);
    } catch (err) {
        console.log('[RESOURCE_DELETE]', err)
        return new NextResponse('Internal error', { status: 500 })
    }
}
```

## Instructions

1. Ask the user for the resource name if not provided.
2. Derive naming variants (singular, plural, PascalCase, UPPER_CASE).
3. Replace all `resource`/`Resource`/`RESOURCE` placeholders with actual names.
4. Substitute field names into destructuring, validation, and Prisma calls.
5. Create the file at the correct path under `admin/app/api/[storeId]/`.
