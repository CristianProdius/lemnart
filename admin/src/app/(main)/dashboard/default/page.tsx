import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user?.id;

  if (userId) {
    const store = await prismadb.store.findFirst({
      where: { userId },
      select: { id: true },
    });

    if (store) {
      redirect(`/dashboard/store/${store.id}`);
    }
  }

  redirect("/dashboard/store/setup");
}
