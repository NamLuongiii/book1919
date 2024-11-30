"use client";

import JSZip from "jszip";
import { useEffect } from "react";
import "./index.css";
import { getFullPath } from "./path";

interface Props {}

const url =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/0f52a9be-a0ec-4138-b3f4-b2848c19e628_alice%20(3).epub?alt=media&token=a6c1ed1e-dd19-494b-af51-fb01546ebf61";

export default function JsZip(props: Props) {
  useEffect(() => {
    load();

    // test function
    // console.log(1, getFullPath("abc.com", "OEBPS/book.dop"));
    // console.log(2, getFullPath("../../STYLES/index.css", "OEBPS/book.dop"));
    // console.log(3, getFullPath("./STYLES/index.css", "book.dop"));
  });

  const load = async () => {
    const container = document.getElementById("test");
    if (!container) throw "no dom container";
    container.innerHTML = "";

    const res = await fetch(url);
    const blob = await res.blob();

    // Đọc file EPUB
    const epub = await JSZip.loadAsync(blob);
    console.log(epub);

    const content = await epub.file("META-INF/container.xml")?.async("string");

    if (!content) throw "container.xml undefined";
    // parse xml
    const parser = new DOMParser();
    const container_dom = parser.parseFromString(content, "application/xml");

    const rootfiles =
      container_dom.documentElement.getElementsByTagName("rootfile");
    if (!rootfiles.length) throw "no rootfile";

    const rootfile = {
      full_path: rootfiles[0].getAttribute("full-path"),
      media_type: rootfiles[0].getAttribute("media-type"),
    };

    // handle opf file
    if (!rootfile.full_path) throw "rootfile full_path not found";
    const opf_content = await epub.file(rootfile.full_path)?.async("string");
    if (!opf_content) throw "no opf";
    const opf_document = parser.parseFromString(opf_content, "application/xml");

    console.log(opf_document.documentElement);

    // manifest
    const manifest_node =
      opf_document.documentElement.querySelector("manifest");
    if (!manifest_node) throw "not found manifest tag";

    // spine
    const spine_node = opf_document.documentElement.querySelector("spine");
    if (!spine_node) throw "not found spine tag";

    const itemrefs = spine_node.querySelectorAll("itemref");

    // render spine item with index
    const render = async (index: number) => {
      const itemref = itemrefs[index];
      if (!itemref) throw "index error";

      const idref = itemref.getAttribute("idref");
      if (!idref) throw "idref not found in ";
      // find item in manifest
      const manifest_item = opf_document.getElementById(idref);
      if (!manifest_item) throw "manifest item not found in " + idref;

      const absolute_href = getFullPath(
        manifest_item.getAttribute("href") ?? "",
        rootfile.full_path ?? ""
      );

      console.log(absolute_href);

      const media_type = manifest_item.getAttribute("media-type");

      // render
      if (media_type == "image/jpeg") {
        // binary data to url
        const blob = await epub
          .file("OEBPS/9171285112962905380_cover.jpg")
          ?.async("blob");

        if (!blob) throw "blob undefined for" + absolute_href;

        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);
        img.onload = () => {
          URL.revokeObjectURL(img.src);
        };

        const test_ele = document.getElementById("test");
        if (test_ele) test_ele.appendChild(img);
        return;
      }

      if (media_type == "application/xhtml+xml") {
        const chapter_content = await epub.file(absolute_href)?.async("string");
        const chapter_document = parser.parseFromString(
          chapter_content ?? "",
          media_type
        );

        // modify image src
        const images =
          chapter_document.documentElement.querySelectorAll("image");
        images.forEach(async (img) => {
          const xlink_href = img.getAttribute("xlink:href");

          if (xlink_href) {
            const full_path_href = getFullPath(xlink_href, absolute_href);
            const blob = await epub.file(full_path_href)?.async("blob");
            if (!blob) throw "image not found";

            img.setAttribute("xlink:href", URL.createObjectURL(blob));
          }
        });

        container.appendChild(chapter_document.documentElement);
      }
    };

    // display spine items
    let index = 0;
    render(index);

    const next = document.getElementById("next");
    if (!next) throw "no next element";

    next.onclick = () => {
      if (index + 1 < itemrefs.length) {
        container.innerHTML = "";
        index++;
        render(index);
      }
    };

    const prev = document.getElementById("prev");
    if (!prev) throw "no prev element";

    prev.onclick = () => {
      if (index - 1 >= 0) {
        container.innerHTML = "";
        index--;
        render(index);
      }
    };
  };

  return (
    <div>
      <div id="test"></div>
      <button id="prev">Quay lại</button>
      <button id="next">Chương tiếp theo</button>
    </div>
  );
}
