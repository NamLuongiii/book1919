import { db } from "@/lib/firebase";
import { FieldPath } from "firebase-admin/firestore";
import { Source } from "../documents/source";

export async function POST(request: Request) {
  const ids = await request.json();

  const snapshot = await db
    .collection("sources")
    .where(FieldPath.documentId(), "in", ids)
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
