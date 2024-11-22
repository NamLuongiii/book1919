"use client";

import ResizeObserver from "rc-resize-observer";
import { ThHTMLAttributes } from "react";

interface Props extends ThHTMLAttributes<HTMLTableHeaderCellElement> {
  pair_id: string;
}

export function ResizeTh({ children, pair_id, ...props }: Props) {
  return (
    <th {...props}>
      <ResizeObserver
        onResize={({ width }) => {
          const ele = document.getElementById(pair_id);
          if (ele) {
            ele.style.width = width + "px";
          }
        }}
      >
        <div className="resize-x overflow-auto">{children}</div>
      </ResizeObserver>
    </th>
  );
}
