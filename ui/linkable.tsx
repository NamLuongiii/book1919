import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Link from "next/link";

interface Props {
  href?: string;
}

export function Linkable({ href }: Props) {
  return (
    <Popover className="relative">
      <PopoverButton className="line-clamp-1 overflow-hidden max-w-[200px]">
        <u>{href}</u>
      </PopoverButton>
      <PopoverPanel
        anchor="bottom"
        className="flex flex-col bg-white border px-2"
      >
        <button>Copy</button>
        <Link href={href ?? ""} target="_blank">
          Go
        </Link>
      </PopoverPanel>
    </Popover>
  );
}
