import { db } from "@/lib/firebase";
import { Button } from "@/ui";
import { FieldPath } from "firebase-admin/firestore";
import Image from "next/image";
import { Source } from "../api/documents/source";

interface Props {
  searchParams: Promise<{ [key: string]: string }>;
}

export default async function ViewScreen({ searchParams }: Props) {
  const sp = await searchParams;
  const slug = sp["slug"];

  const snapshot = await db
    .collection("sources")
    .where(FieldPath.documentId(), "==", slug)
    .get();

  if (snapshot.empty) return "not found";
  const document = snapshot.docs[0];
  const source = { id: document.id, ...document.data() } as Source;

  return (
    <div>
      <section>
        <Image
          alt="source"
          src={source.image_200x300}
          width={100}
          height={150}
        />
        <p>
          <small>{source.name}</small>
        </p>
        <Button to_href={"/read?slug=" + source.id} type="button">
          Read
        </Button>
      </section>
    </div>
  );
}
