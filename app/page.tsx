"use client";

import { Button, Modal, ModalTitle } from "@/ui";
import clsx from "clsx";
import Epub, { Book } from "epubjs";
import Navigation, { NavItem } from "epubjs/types/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface ReaderProgramContext {
  book: Book;
  navigation: Navigation;
}

const context = createContext<ReaderProgramContext | undefined>(undefined);

export default function Home() {
  const [open, setOpen] = useState(false);

  const [config, setConfig] = useState<ReaderProgramContext>();

  useEffect(() => {
    // Load the opf
    var book = Epub("https://s3.amazonaws.com/moby-dick/OPS/package.opf");
    var rendition = book.renderTo("viewer", {
      width: "100%",
      // height: 600,
      ignoreClass: "annotator-hl",
      flow: "scrolled",
    });

    rendition.themes.fontSize("140%");

    // var displayed = rendition.display(3);

    // Navigation loaded
    book.loaded.navigation.then(function (nav) {
      setConfig({ book, navigation: nav });
    });

    var next = document.getElementById("next");
    next?.addEventListener(
      "click",
      function () {
        rendition.next();
      },
      false
    );

    var prev = document.getElementById("prev");
    prev?.addEventListener(
      "click",
      function () {
        rendition.prev();
      },
      false
    );

    var keyListener = function (e: any) {
      // Left Key
      if ((e.keyCode || e.which) == 37) {
        rendition.prev();
      }

      // Right Key
      if ((e.keyCode || e.which) == 39) {
        rendition.next();
      }
    };

    rendition.on("keyup", keyListener);
    document.addEventListener("keyup", keyListener, false);

    rendition.on("relocated", function (location: any) {
      // console.log(location);
    });

    rendition.hooks.render.register(function (view: any) {
      var adder = [
        [".annotator-adder, .annotator-outer", ["position", "fixed"]],
      ];

      view
        .addScript("https://cdn.jsdelivr.net/jquery/3.0.0-beta1/jquery.min.js")
        .then(function () {
          return view.addScript(
            "https://cdn.jsdelivr.net/annotator/1.2.9/annotator-full.min.js"
          );
        })
        .then(function () {
          return view.addCss(
            "https://cdn.jsdelivr.net/annotator/1.2.9/annotator.min.css"
          );
        })
        .then(function () {
          view.addStylesheetRules(adder);

          view.window.Annotator.Util.mousePosition = function (event: any) {
            var body = view.document.body;
            // var offset = view.position();

            return {
              top: event.pageY,
              left: event.pageX,
            };
          };
          var ann = new view.window.Annotator(view.document.body);
        });
    });
  }, []);

  return (
    <context.Provider value={config}>
      <div>
        <div id="viewer"></div>
        <Button id="button-open" onClick={(e) => setOpen(true)}>
          open
        </Button>
        <Modal open={open} onChange={setOpen}>
          <ModalTitle>Navigation</ModalTitle>
          <div className="h-[700px] w-[600px]  overflow-auto">
            {config?.navigation.toc.map((item) => (
              <TableItem key={item.id} toc={item} />
            ))}
          </div>
        </Modal>
        <UiGuide />
      </div>
    </context.Provider>
  );
}

const TableItem = ({ toc }: { toc: NavItem }) => {
  const ctx = useContext(context);
  const cls = "p-2 cursor-pointer border";
  return (
    <div id={toc.id}>
      <div
        onClick={(e) => ctx?.book?.rendition?.display(toc.href)}
        className={cls}
      >
        {toc.label}
      </div>
      {
        !!toc.subitems?.map((sub_item) => (
          <TableItem key={sub_item.id} toc={sub_item} />
        ))
      }
    </div>
  );
};

const UiGuide = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  console.log(visible);

  const guide = () => {
    setVisible(true);
    const btn = document.getElementById("button-open");
    if (!btn) return;

    btn?.classList.add("relative");
    btn?.classList.add("z-50");

    const target_bound = btn?.getBoundingClientRect();

    const circle = ref.current;
    const size = Math.max(target_bound.width, target_bound.height) * 2;
    const _style = circle!.style;

    _style.width = `${size}px`;
    _style.height = `${size}px`;
    _style.display = `block`;
    _style.position = "fixed";
    _style.top = `${target_bound.top}px`;
    _style.left = `${target_bound.left}px`;
  };

  return (
    <div>
      <span onClick={guide}>UI Guide</span>
      <div
        ref={ref}
        className="hidden bg-white rounded-full relative z-45 opacity-30"
      ></div>
      <div
        className={clsx(
          "fixed inset-0 bg-gray-700 opacity-40 hidden",
          visible && "!block"
        )}
        onClick={(e) => {
          e.preventDefault();
          setVisible(false);
        }}
      ></div>
    </div>
  );
};
