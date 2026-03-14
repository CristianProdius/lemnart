import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from "next/navigation";
import  prismadb from '@/lib/prismadb';
import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({ params }:{ params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session?.user) {
        redirect('/sign-in');
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId: session.user.id
        }
    })

    if (!store) {
        redirect('/');
    }

    return (
        <div className="flex-col">
            <div className="flex-1 p-8 pt-6 space-y-4">
                <SettingsForm initialData={store} />
            </div>
        </div>
    )
}

export default SettingsPage
