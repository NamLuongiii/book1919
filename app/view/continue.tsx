"use client";

import { Location } from "epubjs";
import { storage } from "../read/storage";

interface Props {
  slug: string;
}

export function ContinueReading({ slug }: Props) {
  const located: Location | undefined = storage.get(slug)?.located;

  if (!located) return <></>;

  return (
    <div>
      Continue reading from {(located.start.percentage * 100).toFixed(2)}%
    </div>
  );
}
