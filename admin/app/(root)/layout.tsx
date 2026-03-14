import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb";

interface DashboardType {
    children: React.ReactNode;
}

export default async function SetupLayout({children}: DashboardType) {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect('/sign-in')
    }

    const store = await prismadb?.store?.findFirst({
        where: {
            userId: session.user.id
        }
    })

    if (store) {
        redirect(`/${store.id}`);
    }

    return (
        <>
            {children}
        </>
    )
}
