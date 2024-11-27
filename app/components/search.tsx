"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWRMutation from "swr/mutation";

interface Props {}

interface Hit {
  _index: string;
  _id: string;
  _source: {
    name: string;
    image_60x90: string;
  };
}

export function Search(props: Props) {
  return (
    <div className="absolute left-1/2 translate-x-[-50%]">
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton>
              <input
                type="search"
                placeholder="search abc..."
                className="border search_input"
                readOnly
              />
            </PopoverButton>
            <AutoFocus open={open} />
          </>
        )}
      </Popover>
    </div>
  );
}

const AutoFocus = ({ open }: { open: boolean }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [sources, setSources] = useState<Hit[]>([]);
  const [mess, setMess] = useState("");

  useEffect(() => {
    if (open) ref.current?.focus();
  }, [open]);

  // search
  const { isMutating, trigger } = useSWRMutation(
    "search",
    async (key, { arg }: { arg: string }) => {
      const res = await fetch("/api/source/search?search=" + arg);
      const result: Hit[] = await res.json();

      setSources(result);
      if (result.length || arg == "") {
        setMess("");
      } else {
        setMess(`No data match "${arg}"`);
      }
    }
  );

  // submit
  const submit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    trigger(formData.get("search") as string);
  };

  return (
    <PopoverPanel id="search" anchor="bottom" className="border shadow-sm">
      <form onSubmit={submit}>
        <input
          ref={ref}
          name="search"
          type="search"
          placeholder="search abc..."
          className="border search_input"
          autoFocus
          spellCheck={false}
          disabled={isMutating}
        />
      </form>

      <p>
        <small>
          <i>{mess}</i>
        </small>
      </p>

      {sources.map((source) => (
        <Link
          key={source._id}
          href={"/view?slug=" + source._id}
          className="search__item"
        >
          <Image
            src={source._source.image_60x90}
            alt="book"
            width={40}
            height={60}
          />
          <p>{source._source.name}</p>
        </Link>
      ))}
    </PopoverPanel>
  );
};
