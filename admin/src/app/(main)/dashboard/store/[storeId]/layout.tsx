import { headers } from 'next/headers'
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb";
import { auth } from "@/lib/auth";

interface StoreLayoutProps {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>
}

export default async function StoreLayout({ children, params }: StoreLayoutProps) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const { storeId } = await params;

    if (!session?.user) {
        redirect('/sign-in')
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId: session.user.id
        }
    })

    if (!store) {
        redirect('/dashboard');
    }

    return <>{children}</>
}
