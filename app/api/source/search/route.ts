import { searchElastic } from "@/lib/elasticsearch";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const search = (await request.nextUrl.searchParams.get("search")) || "";

  const hits = await searchElastic(search);

  return new Response(JSON.stringify(hits), {
    headers: { "Content-Type": "application/json" },
  });
}
