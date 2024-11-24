import { db } from "@/lib/firebase";
import { ButtonIcon } from "@/ui";
import { Linkable } from "@/ui/linkable";
import { ResizeTh } from "@/ui/resize-th";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { Source } from "../api/documents/source";

interface Props {
  params: any;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

const Limit = 20;

export default async function SourceMng({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Number(sp["page"] || 1);
  const size = Number(sp["size"] || Limit);
  const name = sp["name"] || "";

  let collectionRef;

  if (name) {
    collectionRef = db
      .collection("sources")
      .where("name", "==", name)
      .orderBy("createdAt", "desc");
  } else {
    collectionRef = db.collection("sources").orderBy("createdAt", "desc");
  }

  const count = (await collectionRef.count().get()).data().count;
  const number_of_page = Math.ceil(count / size);

  let query = collectionRef.limit(size);

  if (page > 1) {
    const lastPageSnapshot = await collectionRef.limit((page - 1) * size).get();

    const lastDocument =
      lastPageSnapshot.docs[lastPageSnapshot.docs.length - 1];

    if (lastDocument) {
      query = collectionRef.startAfter(lastDocument).limit(size);
    }
  }

  const snapshot = await query.get();

  const sources = snapshot.docs.map((snap) => ({
    id: snap.id,
    ...snap.data(),
  })) as Source[];

  const has_previous_page = page - 1 > 0;
  const has_next_page = page + 1 <= number_of_page;

  return (
    <div>
      <div className="sticky-header">
        <div className="table-pagination">
          <label htmlFor="page" className="item1">
            {page} of {number_of_page}
          </label>
          <label htmlFor="" className="item2">
            {count} records
          </label>
          <Link
            href={"?page=" + (page - 1) + `&size=${size}&name=${name}`}
            className={clsx(
              !has_previous_page && "pointer-events-none",
              "item3"
            )}
          >
            <ButtonIcon icon="arrow-long-left" disabled={!has_previous_page} />
          </Link>
          <form action="" method="get" className="item4">
            <input
              id="page"
              className="w-16"
              type="number"
              step={1}
              min={1}
              defaultValue={page}
              name="page"
              placeholder="Page"
            />

            <label htmlFor="size">Page size</label>
            <select name="size" id="size" defaultValue={size}>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <input
              id="name"
              placeholder="Search by name"
              type="text"
              name="name"
              defaultValue={name}
            />
            <button type="submit"></button>
          </form>
          <Link
            href={"?page=" + (page + 1) + `&size=${size}&name=${name}`}
            className={clsx(!has_next_page && "pointer-events-none", "item5")}
          >
            <ButtonIcon icon="arrow-long-right" disabled={!has_next_page} />
          </Link>

          <Link href="/source/create">
            <button>Create</button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <ResizeTh pair_id="a">a</ResizeTh>
                <ResizeTh pair_id="b">b</ResizeTh>
              </tr>
            </thead>
          </table>
        </div>
      </div>

      <div className="overflow-x-auto relative top-[-30px]">
        <table>
          <thead>
            <tr>
              <th>
                <div id="a">a</div>
              </th>
              <th>
                <div id="b">b</div>
              </th>
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

          {!sources.length && (
            <tfoot>
              <tr>
                <td colSpan={100} className="text-center">
                  No data match
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
