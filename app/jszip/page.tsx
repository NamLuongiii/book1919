"use client";

import { Popover } from "@headlessui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import clsx from "clsx";
import JSZip from "jszip";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import "./index.css";
import { getFullPath, isRelative } from "./path";
import { wait } from "./wait";

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

  // save position

  useEffect(() => {
    const removeListener = load();

    return () => {
      removeListener.then((remove) => {
        remove();
      });
    };
  });

  const displayNavigation = async (epub: JSZip, root: string) => {
    // parse file
    const parser = new DOMParser();
    const base_path = root;
    if (!base_path) throw "opf not found";

    const opf_content = await epub.file(root)?.async("string");
    if (!opf_content) throw "no opf";
    const opf_document = parser.parseFromString(opf_content, "application/xml");

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
          data["href"] = getFullPath(a.getAttribute("href") ?? "", base_path2);
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

    const files: string[] = [];
    epub.forEach((d) => {
      files.push(d);
    });

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

    displayNavigation(epub, rootfile.full_path);

    // manifest
    const manifest_node =
      opf_document.documentElement.querySelector("manifest");
    if (!manifest_node) throw "not found manifest tag";

    // spine
    const spine = opf_document.documentElement.querySelector("spine");
    if (!spine) throw "not found spine tag";
    const spine_items = spine.querySelectorAll("itemref");

    const root_document = opf_document;
    const root_path = rootfile.full_path ?? "";

    let rendered_path: string;

    // render spine item with index
    const render = async (index: number | string) => {
      let path: string;
      let media_type: string;
      let position: string = "";

      // index in spine
      if (typeof index == "number") {
        const item = spine_items[index];
        if (!item) throw "index not found";

        const id = item.getAttribute("idref");
        const manifest_item = root_document.getElementById(id ?? "");
        if (!manifest_item) throw "id not found in manifest";
        const href = manifest_item.getAttribute("href");

        path = getFullPath(href ?? "", root_path);
        const _media_type = manifest_item.getAttribute("media-type");
        if (!_media_type) throw "not found media type";
        media_type = _media_type;
      } else {
        path = index.split("!")[0];
        position = index.split("!")[1];

        if (!files.includes(path)) {
          path = files.find((p) => path.startsWith(p)) ?? "";
        }

        if (!path) throw "document path not found";

        if (path.includes("xhtml")) {
          media_type = "application/xhtml+xml";
        } else {
          media_type = "";
        }
      }

      // render
      if (media_type == "image/jpeg") {
        // binary data to url
        const blob = await epub
          .file("OEBPS/9171285112962905380_cover.jpg")
          ?.async("blob");

        if (!blob) throw "blob undefined for" + path;

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
        const chapter_content = await epub.file(path)?.async("string");
        const chapter_document = parser.parseFromString(
          chapter_content ?? "",
          media_type
        );

        // modify style src
        const styles = chapter_document.documentElement.querySelectorAll(
          'link[rel="stylesheet"]'
        );
        for (const style of styles) {
          const href = style.getAttribute("href");
          if (href) {
            const css_path = getFullPath(href, path);

            const content = await epub.file(css_path)?.async("string");
            if (!content) return;
            const styleTag = chapter_document.createElement("style");
            styleTag.textContent = content; // Thêm nội dung CSS
            // Thay thế thẻ <link> bằng thẻ <style>
            style.replaceWith(styleTag);
          }
        }

        // modify image src
        const images =
          chapter_document.documentElement.querySelectorAll("image");
        for (const img of images) {
          const xlink_href = img.getAttribute("xlink:href");

          if (xlink_href) {
            const full_path_href = getFullPath(xlink_href, path);
            const blob = await epub.file(full_path_href)?.async("blob");
            if (!blob) throw "image not found";

            img.setAttribute("xlink:href", URL.createObjectURL(blob));
          }
        }

        chapter_document.documentElement.style.fontSize = "20px";
        chapter_document.documentElement.style.wordSpacing = "4px";

        const doc = container.contentWindow?.document;

        if (doc) {
          doc.open();
          doc.write(chapter_document.documentElement.outerHTML);
          doc.close();

          const content_height = doc.querySelector("html")?.scrollHeight;
          container.style.height = content_height + "px";

          // modify a tag
          const links = doc.querySelectorAll("a");
          for (const link of links) {
            const href = link.getAttribute("href");
            if (!href) continue;
            if (isRelative(href)) {
              link.onclick = (e) => {
                e.preventDefault();
                const full_path = getFullPath(href, path);
                render(full_path);
              };
            } else {
              link.setAttribute("target", "_blank");
            }
          }
        }

        // scroll to position
        const body = doc?.querySelector("body");
        if (!body) throw "body not found";

        if (position) {
          const ps = position.split(":").map((v) => Number(v));
          let target: Element[] = [body];
          let final_element;

          for (let i = 0; i < ps.length; i++) {
            const p = ps[i];
            final_element = target[p];
            target = Array.from(final_element.children);
          }

          if (final_element) {
            final_element.scrollIntoView();
          }
        }
      }

      rendered_path = path;
    };

    // display spine items
    let r = localStorage.getItem("r");
    render(r ?? 2);

    let next = document.getElementById("next");
    if (!next) {
      next = document.createElement("button");
      next.id = "next";
      next.innerText = "Chương tiếp theo";

      const rs = document.getElementById("reading-sytem");
      if (!rs) throw "rs next element";
      setTimeout(() => {
        if (next) rs.appendChild(next);
      }, 2000);
    }

    next.onclick = () => {
      // if (index + 1 < spine_items.length) {
      //   container.innerHTML = "";
      //   index++;
      //   render(index);
      //   router.push("?i=" + index);
      // }
    };

    const check = () => {
      wait(() => {
        const container = document.getElementById(
          "test"
        ) as HTMLIFrameElement | null;
        if (!container) throw "no dom container";
        container.innerHTML = "";

        const iframe_document = container.contentWindow?.document;
        const body = iframe_document?.querySelector("body");
        if (!body) throw "body not found";
        const p = traveling(body, 0);
        localStorage.setItem("r", `${rendered_path}!${p}`);
      });
    };

    document.addEventListener("scroll", check);

    return () => document.removeEventListener("scroll", check);
  };

  const traveling = (element: Element, count?: number): string => {
    const container = document.getElementById(
      "test"
    ) as HTMLIFrameElement | null;
    if (!container) throw "no dom container";
    container.innerHTML = "";

    const rect = element.getBoundingClientRect();
    const iframeRect = container.getBoundingClientRect();

    const elementViewportPosition = {
      top: iframeRect.top + rect.top,
      left: iframeRect.left + rect.left,
      bottom: iframeRect.top + rect.bottom,
      right: iframeRect.left + rect.right,
    };

    // not visible => end
    if (
      elementViewportPosition.bottom <= 0 ||
      elementViewportPosition.top >= window.innerHeight
    ) {
      return "";
    } // end

    if (!element.childElementCount) {
      console.log(element);
      return count + "";
    }

    let segment = count + "";

    const childrens = Array.from(element.children);
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[i];

      const r = traveling(child, i);
      if (r) {
        segment += `:${r}`;
        break;
      }
    }

    return segment;
  };

  return (
    <div id="reading-sytem">
      <header id="reading-system__header">
        <Popover>
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
      <iframe id="test"></iframe>
    </div>
  );
}
