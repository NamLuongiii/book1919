"use client";

import { Popover } from "@headlessui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import clsx from "clsx";
import JSZip from "jszip";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "./index.css";
import { getFullPath } from "./path";

interface Props {}

const url =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/0f52a9be-a0ec-4138-b3f4-b2848c19e628_alice%20(3).epub?alt=media&token=a6c1ed1e-dd19-494b-af51-fb01546ebf61";

export default function JsZip(props: Props) {
  const router = useRouter();
  const sp = useSearchParams();

  // show / hide header
  useScrollPosition(({ prevPos, currPos }) => {
    const h = document.getElementById("reading-system__header");
    if (!h) return;

    if (prevPos.y < currPos.y) {
      // show
      h.style.display = "block";
    } else {
      h.style.display = "none";
    }
  });

  useEffect(() => {
    load();

    // test function
    // console.log(1, getFullPath("abc.com", "OEBPS/book.dop"));
    // console.log(2, getFullPath("../../STYLES/index.css", "OEBPS/book.dop"));
    // console.log(3, getFullPath("./STYLES/index.css", "book.dop"));
  });

  const load = async () => {
    const container = document.getElementById(
      "test"
    ) as HTMLIFrameElement | null;
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

      if (!absolute_href) throw "no base path";

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

        console.log(chapter_document);

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

        chapter_document.documentElement.style.fontSize = "20px";
        chapter_document.documentElement.style.wordSpacing = "4px";

        const doc = container.contentWindow?.document;
        if (doc) {
          doc.open();
          doc.write(chapter_document.documentElement.outerHTML);
          doc.close();

          const content_height = doc.querySelector("html")?.scrollHeight;
          container.style.height = content_height + "px";
        }
      }
    };

    // render navigation: only support epub 3.3
    const renderNavigation = async () => {
      // parse file
      const base_path = rootfile.full_path;
      if (!base_path) throw "opf not found";

      const nav_item = opf_document.querySelector("item[properties=nav]");

      if (!nav_item) throw "file not support anv item";

      const href = nav_item.getAttribute("href");
      const media_type = nav_item.getAttribute("media-type");

      if (!href || !media_type) throw "toc item data not found";

      const base_path2 = getFullPath(href, base_path);
      const content = await epub.file(base_path2)?.async("string");
      if (!content) throw "blob file failed";

      const toc_document = parser.parseFromString(
        content,
        "application/xhtml+xml"
      );

      // render nav data
      const nav = toc_document.querySelector("nav");
      if (!nav) throw "nav element not found";

      const ol = nav.firstElementChild;

      // de quy lay data
      interface Item {
        href?: string | null;
        id?: string | null;
        label?: string | null;
        items?: Item[];
      }

      const getData = (ol: HTMLOListElement): Item[] => {
        const lis = ol.children;

        let navigation_data: Item[] = [];

        for (const li of lis) {
          let data: Item = {};
          const a = li.querySelector(":scope > a");
          const span = li.querySelector(":scope > span");

          if (a) {
            data["id"] = a.getAttribute("id");
            data["href"] = getFullPath(
              a.getAttribute("href") ?? "",
              base_path2
            );
            data["label"] = a.textContent;
          } else if (span) {
            data["id"] = span.getAttribute("id");
            data["label"] = span.textContent;
          }

          const child_ol = li.querySelector(":scope > ol");

          if (child_ol) {
            data["items"] = getData(child_ol as HTMLOListElement);
          }

          navigation_data.push(data);
        }

        return navigation_data;
      };

      // render data
      if (ol) {
        const data = getData(ol as HTMLOListElement);

        const render = (data: Item[]) => {
          const ol = document.createElement("ol");
          ol.id = "table-of-contents";

          for (let i = 0; i < data.length; i++) {
            const element = data[i];

            const li = document.createElement("li");
            let first;

            if (element.href) {
              first = document.createElement("p");
              first.onclick = async () => {};
              if (element.id) first.id = element.id;
              if (element.label) first.innerText = element.label;
            } else {
              first = document.createElement("strong");
              if (element.id) first.id = element.id;
              if (element.label) first.innerText = element.label;
            }

            li.appendChild(first);

            if (element.items) {
              li.appendChild(render(element.items));
            }

            ol.appendChild(li);
          }

          return ol;
        };

        const _ol = render(data);

        const navigation = document.getElementById("navigation");
        if (navigation) navigation.appendChild(_ol);
      }
    };

    // display spine items
    let index = sp.get("i") ? Number(sp.get("i")) : 0;
    render(index);

    // render navigation
    renderNavigation();

    const next = document.getElementById("next");
    if (!next) throw "no next element";

    next.onclick = () => {
      if (index + 1 < itemrefs.length) {
        container.innerHTML = "";
        index++;
        render(index);
        router.push("?i=" + index);
      }
    };

    const prev = document.getElementById("prev");
    if (!prev) throw "no prev element";

    prev.onclick = () => {
      if (index - 1 >= 0) {
        container.innerHTML = "";
        index--;
        render(index);
        router.push("?i=" + index);
      }
    };
  };

  return (
    <div>
      <header id="reading-system__header">
        <Popover popoverTarget="target">
          {({ open }) => (
            <>
              <Popover.Button>Open Popover</Popover.Button>
              <Popover.Panel
                static
                className={clsx(
                  open ? "block" : "hidden",
                  "p-4 bg-gray-100 border rounded absolute z-10000"
                )}
              >
                <h1>Table of contents</h1>
                <div id="navigation"></div>
              </Popover.Panel>
            </>
          )}
        </Popover>
      </header>
      <iframe id="test" seamless></iframe>
      <button id="prev">Quay lại</button>
      <button id="next">Chương tiếp theo</button>
      <div id="target"></div>
    </div>
  );
}
