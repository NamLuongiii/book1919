import { db } from "@/lib/firebase";
import { FieldPath } from "firebase-admin/firestore";
import ReadPc from "./read-pc";

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function ReadScreen({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = sp["slug"];

  if (!slug) return "not found";

  const snapshot = await db
    .collection("sources")
    .where(FieldPath.documentId(), "==", slug)
    .get();

  if (snapshot.empty) return "not found";
  const document = snapshot.docs[0].data();

  return <ReadPc source={document.source} slug={slug} />;
}
