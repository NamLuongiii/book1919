"use client";

import JSZip from "jszip";
import { useEffect } from "react";

interface Props {}

const url = "https://s3.amazonaws.com/moby-dick/moby-dick.epub";

export default function JsZip(props: Props) {
  useEffect(() => {
    load();
  });

  const load = async () => {
    const res = await fetch(url);
    const blob = await res.blob();

    // Đọc file EPUB
    const epub = await JSZip.loadAsync(blob);
    const content = await epub.file("OPS/package.opf")?.async("string");

    const test_ele = document.getElementById("test");
    if (test_ele) test_ele.innerHTML = content ?? "";
  };

  return <div id="test">hello</div>;
}
