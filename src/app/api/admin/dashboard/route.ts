import { verifyAdminAccess } from "@/lib/admin/access";
import { getOutreachDatabase, loadDashboard } from "@/lib/admin/dashboard";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const access = await verifyAdminAccess(
    request.headers.get("cf-access-jwt-assertion"),
  );
  if (!access.ok) {
    return NextResponse.json(
      { error: "Admin access unavailable" },
      {
        status: access.status,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }

  const db = getOutreachDatabase(access.env);
  if (!db)
    return NextResponse.json(
      { error: "Outreach data unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );

  try {
    const dashboard = await loadDashboard(db);
    return NextResponse.json(dashboard, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Outreach data unavailable" },
      {
        status: 503,
        headers: { "Cache-Control": "private, no-store" },
      },
    );
  }
}
