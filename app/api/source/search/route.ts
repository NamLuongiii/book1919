import { db } from "@/lib/firebase";
import { NextRequest } from "next/server";
import { Source } from "../../documents/source";

export async function GET(request: NextRequest) {
  const search = await request.nextUrl.searchParams.get("search");

  const snapshot = await db
    .collection("sources")
    .where("name", "==", search)
    .limit(10)
    .get();

  const data: Source[] = snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as Source)
  );

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
