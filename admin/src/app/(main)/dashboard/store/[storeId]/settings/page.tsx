import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from "next/navigation";
import prismadb from '@/lib/prismadb';
import { SettingsForm } from "./_components/settings-form";

const SettingsPage = async ({ params }: { params: Promise<{ storeId: string }> }) => {
    const { storeId } = await params;
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session?.user) {
        redirect('/sign-in');
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

    return (
        <div className="space-y-4">
            <SettingsForm initialData={store} />
        </div>
    )
}

export default SettingsPage
