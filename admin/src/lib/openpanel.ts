const OPENPANEL_API = "https://api.openpanel.dev";

interface OpenPanelChartParams {
  projectId: string;
  event: string;
  interval: "hour" | "day" | "week" | "month";
  range: string; // e.g. "30d", "7d"
  breakdowns?: string[];
}

export async function fetchOpenPanelChart(params: OpenPanelChartParams) {
  const clientId = process.env.OPENPANEL_CLIENT_ID;
  const secret = process.env.OPENPANEL_SECRET;

  if (!clientId || !secret) {
    return null;
  }

  const url = new URL("/export/charts", OPENPANEL_API);

  const body = {
    projectId: params.projectId,
    series: [{ event: params.event }],
    interval: params.interval,
    range: params.range,
    ...(params.breakdowns && { breakdowns: params.breakdowns }),
  };

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "openpanel-client-id": clientId,
      "openpanel-client-secret": secret,
    },
    body: JSON.stringify(body),
    next: { revalidate: 300 }, // cache for 5 minutes
  });

  if (!response.ok) {
    console.log("[OPENPANEL_FETCH]", response.status, await response.text());
    return null;
  }

  return response.json();
}
