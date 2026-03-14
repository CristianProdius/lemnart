import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb";
import Navbar from "@/components/navbar";

interface DashboardType {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>
}

export default async function Dashboard({children, params}: DashboardType) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const { storeId } = await params;

    if (!session?.user) {
        redirect('/sign-in')
    }

    const store = await prismadb?.store.findFirst({
        where: {
            id: storeId,
            userId: session.user.id
        }
    })

    if (!store) {
        redirect('/');
    }

    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}
