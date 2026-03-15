import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { fetchOpenPanelChart } from "@/lib/openpanel";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    const userId = session?.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { storeId } = await params;

    const store = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!store) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const clientId = process.env.OPENPANEL_CLIENT_ID;
    if (!clientId) {
      return NextResponse.json({ configured: false, data: null });
    }

    const url = new URL(req.url);
    const range = url.searchParams.get("range") ?? "30d";
    const interval =
      (url.searchParams.get("interval") as "hour" | "day" | "week" | "month") ??
      "day";

    const data = await fetchOpenPanelChart({
      projectId: clientId,
      event: "screen_view",
      interval,
      range,
    });

    return NextResponse.json({ configured: true, data });
  } catch (error) {
    console.log("[ANALYTICS_TRAFFIC_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
