import { NextResponse } from "next/server";

const DIAGNOSTIC_HEADER_ALLOWLIST = [
  "accept",
  "accept-language",
  "cf-connecting-ip",
  "cf-ipcountry",
  "cf-ray",
  "host",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "user-agent",
  "x-forwarded-for",
  "x-forwarded-host",
  "x-forwarded-proto",
];

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const requestId = crypto.randomUUID();
  const url = new URL(request.url);
  const headers = Object.fromEntries(
    DIAGNOSTIC_HEADER_ALLOWLIST.map((header) => [
      header,
      request.headers.get(header) || undefined,
    ]).filter(([, value]) => Boolean(value))
  );

  const diagnostics = {
    event: "connectivity_diagnostics",
    requestId,
    timestamp: new Date().toISOString(),
    url: {
      host: url.host,
      pathname: url.pathname,
      protocol: url.protocol,
    },
    headers,
  };

  console.info(JSON.stringify(diagnostics));

  return NextResponse.json(
    {
      ok: true,
      requestId,
      timestamp: diagnostics.timestamp,
      message: "Coast Competitions connectivity diagnostics reached the application.",
    },
    {
      headers: {
        "cache-control": "no-store",
        "x-request-id": requestId,
      },
    }
  );
}
