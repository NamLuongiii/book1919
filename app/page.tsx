import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { Source } from "./api/documents/source";
import BookMe from "./components/book-me";

export interface Props {}

export default async function Home(props: Props) {
  const snapshot = await db
    .collection("sources")
    .orderBy("createdAt", "desc")
    .limit(10)
    .get();

  const sources: Source[] = snapshot.docs.map(
    (_snapshot) =>
      ({
        id: _snapshot.id,
        ..._snapshot.data(),
      } as Source)
  );

  return (
    <div>
      <BookMe />

      <section className="home_section">
        <h1 className="home_section__title">
          <strong>Abc list</strong>
        </h1>

        {sources.map((source) => (
          <Link
            key={source.id}
            href={"/view?slug=" + source.id}
            className="home_section__item"
          >
            <Image
              alt="source"
              src={source.image_200x300}
              width={100}
              height={150}
            />
            <p>
              <small>{source.name}</small>
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
