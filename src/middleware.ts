import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.hostname !== "boondocklabs.co.za") {
    return NextResponse.next();
  }

  const canonicalUrl = request.nextUrl.clone();
  canonicalUrl.protocol = "https:";
  canonicalUrl.hostname = "www.boondocklabs.co.za";
  return NextResponse.redirect(canonicalUrl, 307);
}
