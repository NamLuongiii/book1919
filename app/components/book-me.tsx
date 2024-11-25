"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Source } from "../api/documents/source";
import { LocalStorageObject, storage } from "../read/storage";

interface Props {}

export default function BookMe(props: Props) {
  const [sources, setSources] = useState<Source[]>([]);
  const [storage_data, setStorageData] = useState<LocalStorageObject>({});

  useEffect(() => {
    const storage_data = storage.getAll();
    setStorageData(storage_data);

    const ids = Object.keys(storage_data);

    async function _fetch() {
      let res = await fetch("/api/source", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ids),
      });
      let data = await res.json();

      setSources(data);
    }

    _fetch();
  }, []);

  return (
    <section className="home_section">
      <h1 className="home_section__title">
        <strong>Me</strong>
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

          <small>
            <i>
              {source.id
                ? storage_data[source.id].located?.start.percentage
                  ? (
                      (storage_data[source.id].located?.start
                        .percentage as number) * 100
                    ).toFixed(2) + "%"
                  : ""
                : ""}
            </i>
          </small>
        </Link>
      ))}
    </section>
  );
}
