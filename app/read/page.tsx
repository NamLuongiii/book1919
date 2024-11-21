"use client";

import { Button, ButtonIcon, Modal, ModalTitle } from "@/ui";
import clsx from "clsx";
import Epub, { Book } from "epubjs";
import Navigation, { NavItem } from "epubjs/types/navigation";
import Image from "next/image";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface ReaderProgramContext {
  book: Book;
  navigation: Navigation;
}

const context = createContext<ReaderProgramContext | undefined>(undefined);

export default function Home() {
  const [open, setOpen] = useState(false);

  const [config, setConfig] = useState<ReaderProgramContext>();
  const [mounted, setMounted] = useState(false);

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

    var displayed = rendition.display(3).then(() => {
      const show_guide = localStorage.getItem("guide");
      if (show_guide != "false") setMounted(true);
    });

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
        <div id="viewer" className="*:!overflow-x-hidden"></div>
        <ButtonIcon
          id="button-open"
          className="fixed right-4 bottom-6"
          onClick={(e) => setOpen(true)}
          icon="menu"
        />

        <footer className="text-center space-x-4 py-6">
          <Button onClick={(e) => config?.book.rendition.prev()}>
            Chương cũ
          </Button>
          <Button onClick={(e) => config?.book.rendition.next()}>
            Chương mới
          </Button>
        </footer>

        <Modal open={open} onChange={setOpen}>
          <ModalTitle>Navigation</ModalTitle>
          <div className="h-[500px] w-[600px]  overflow-auto">
            {config?.navigation.toc.map((item) => (
              <TableItem key={item.id} toc={item} />
            ))}
          </div>
        </Modal>
        {mounted && <UiGuide />}
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
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const [index, setIndex] = useState(1);

  const step_1 = () => {
    const btn = document.getElementById("button-open");
    if (!btn) return;

    const target_bound = btn?.getBoundingClientRect();

    const copy_btn = btn?.cloneNode(true);

    const container = ref.current;
    if (!container) return;

    const _copy_node = container.appendChild(copy_btn) as HTMLElement;

    _copy_node?.classList.add("fixed");
    _copy_node?.classList.add("z-50");
    _copy_node.style.top = `${target_bound.top}px`;
    _copy_node.style.left = `${target_bound.left}px`;
    _copy_node.style.scale = `1.2`;
    _copy_node.style.outline = `4px solid #fff`;
    _copy_node.style.outlineOffset = `2px`;

    _copy_node.onclick = () => {
      setIndex(2);
    };
    // copy_btn?.classList.add("pointer-events-none");
  };

  const step_2 = () => {
    setIndex(3);
  };

  const step_3 = () => {
    setVisible(false);
  };

  useEffect(() => {
    step_1();
  });

  const Message = (message: string) => (
    <div className=" bg-white rounded text-lg p-4">{message}</div>
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    localStorage.setItem("guide", "false");
    setVisible(false);
  };

  if (!visible) return <></>;

  return (
    <div ref={ref}>
      {index === 1 && (
        <AlignCenter>
          {Message("Nhấn vào button màu xanh để mở mục lục")}
          <form
            className="bg-white"
            onSubmit={handleSubmit}
            onChange={handleSubmit}
          >
            <label htmlFor="turn-off-guide">
              Không hiển thị phần hướng dẫn nữa!
            </label>
            <input type="checkbox" id="turn-off-guide" />
          </form>
        </AlignCenter>
      )}
      {index === 2 && (
        <AlignCenter>
          <Image
            src="/table-of-content.png"
            width={400}
            height={600}
            alt="toc"
          />
          {Message("Làm tốt lắm")}
          <Button onClick={step_2}>Tiếp tục</Button>
        </AlignCenter>
      )}

      {index === 3 && (
        <AlignCenter>
          <Image
            src="/table-of-content.png"
            width={400}
            height={600}
            alt="toc"
          />
          {Message("Để thay đổi font chữ chọn Tab [Hiển thị]")}
          {Message("Chọn Tab [Shortcuts] để xem các phím tắt được hỗ trợ ")}
          <Button onClick={step_3}>Hoàn thành</Button>
        </AlignCenter>
      )}

      <div className={clsx("fixed inset-0 bg-gray-700 opacity-40")}></div>
    </div>
  );
};

const AlignCenter = ({ children }: { children: ReactNode }) => {
  return (
    <div className="fixed z-50 top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
      {children}
    </div>
  );
};
