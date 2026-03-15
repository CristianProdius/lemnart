import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import prismadb from "@/lib/prismadb";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const store = await prismadb.store.findFirst({
    where: { userId: session.user.id },
  });

  if (store) {
    redirect(`/dashboard/store/${store.id}`);
  } else {
    redirect("/dashboard/store/setup");
  }
}
