import { db } from "@/lib/firebase";
import { Linkable } from "@/ui/linkable";
import Image from "next/image";
import { Source } from "../api/documents/source";

interface Props {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Limit = 2;

export default async function SourceMng({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp["page"] ?? 1);

  const collectionRef = db.collection("sources").orderBy("createdAt");
  let query = collectionRef.limit(Limit);

  if (page > 1) {
    const lastPageSnapshot = await collectionRef
      .limit((page - 1) * Limit)
      .get();

    const lastDocument =
      lastPageSnapshot.docs[lastPageSnapshot.docs.length - 1];

    if (lastDocument) {
      query = collectionRef.startAfter(lastDocument).limit(Limit);
    }
  }

  const snapshot = await query.get();

  const sources = snapshot.docs.map((snap) => ({
    id: snap.id,
    ...snap.data(),
  })) as Source[];

  return (
    <div>
      <div>
        <form action="#" method="get">
          <input
            className="w-24"
            type="number"
            step={1}
            min={1}
            defaultValue={page}
            name="page"
            placeholder="Page"
          />
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>a</th>
            <th>b</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => (
            <tr key={source.id}>
              <td>
                <div className="flex items-center gap-2">
                  <Image
                    src={source.image_60x90}
                    width={60}
                    height={90}
                    alt=""
                  />
                  <p>{source.name}</p>
                </div>
              </td>
              <td>
                <Linkable href={source.source} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
