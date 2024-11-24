"use client";

import { ButtonIcon } from "@/ui";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import Epub, { Location, Rendition } from "epubjs";
import Navigation, { NavItem } from "epubjs/types/navigation";
import { PackagingMetadataObject } from "epubjs/types/packaging";
import Section from "epubjs/types/section";
import { useEffect, useState } from "react";
import "./index.css";

interface Props {}

const example =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/Harry%20Potter%20-%20J.%20K.%20Rowling.epub?alt=media&token=ffafac1f-ed65-4779-b0f9-bd370dfd1ce2";

export default function Read(props: Props) {
  const [toc, setToc] = useState<Navigation>();
  const [rendition, setRendition] = useState<Rendition>();
  const [metadata, setMetadata] = useState<PackagingMetadataObject>();
  const [currentNav, setCurrNav] = useState<NavItem>();
  const [location, setLocation] = useState<Location>();
  const [count_of_location, setCountOfLocation] = useState<number>();

  useEffect(() => {
    var book = Epub(example);
    var rendition = book.renderTo("viewer", {
      width: "100%",
      height: "100%",
    });

    setRendition(rendition);

    rendition.themes.fontSize("120%");
    rendition.themes.font("Arial");

    // get the saved location
    const _key_saved_location = "book-relocated";
    const _saved_location = localStorage.getItem(_key_saved_location);

    if (_saved_location) {
      const location = JSON.parse(_saved_location) as Location;
      rendition.display(location?.start.cfi);
    } else rendition.display();

    rendition.on("rendered", (renderer: any) => {
      // -- do stuff
      const _renderer = renderer as Section;
      const href = _renderer.href;

      const toc = book.navigation.get(href);
      setCurrNav(toc);
    });

    book.loaded.metadata.then((metadata) => {
      setMetadata(metadata);
    });

    // Navigation loaded
    book.loaded.navigation.then(function (toc) {
      setToc(toc);
    });

    // Generate locations
    book.ready.then(() => {
      const _key = "book-location";
      const location = localStorage.getItem(_key);

      if (location) {
        const _location = JSON.parse(location);
        book.locations.load(_location);
        setCountOfLocation(_location.length);
      } else {
        book.locations.generate(150).then((location: string[]) => {
          localStorage.setItem(_key, JSON.stringify(location));
          setCountOfLocation(location.length);
        });
      }
    });

    // Listen location change
    rendition.on("relocated", (location: Location) => {
      localStorage.setItem(_key_saved_location, JSON.stringify(location));
      setLocation(location);
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

    return () => {
      book.destroy();
    };
  }, []);

  // render toc
  const renderToc = (toc?: NavItem[]) => {
    if (!toc) return <></>;

    return toc.map((nav_item) => {
      if (!nav_item.subitems?.length)
        return (
          <div
            key={nav_item.id}
            className="table-of-contents__chapter"
            onClick={(e) => rendition?.display(nav_item.href)}
          >
            {nav_item.label}
          </div>
        );

      return (
        <div key={nav_item.id}>
          <strong>{nav_item.label}</strong>
          {renderToc(nav_item.subitems)}
        </div>
      );
    });
  };

  // caulate percentage

  return (
    <div>
      <header id="read-header">
        <Popover>
          <PopoverButton>
            <ButtonIcon icon="numbered-list" title="table of contents" />
          </PopoverButton>
          <PopoverPanel anchor="bottom" className="panel">
            <h1 className="table-of-contents__title">Table of contents</h1>
            <div className="table-of-contents">
              {renderToc(toc?.toc)}

              <hr />
              <div className="text-center">
                <p>
                  <i>{metadata?.title}</i>
                </p>
                <p>
                  <small>{metadata?.creator}</small>
                </p>
              </div>
            </div>
          </PopoverPanel>
        </Popover>

        <div className="current-nav">
          <i>{currentNav?.label}</i>
        </div>
      </header>

      <div id="book-section">
        <div id="viewer" className="spreads"></div>
        <div id="prev" className="arrow">
          ‹
        </div>
        <div id="next" className="arrow">
          ›
        </div>
      </div>

      {!!location && !!count_of_location && (
        <div id="location">
          <small className="absolute left-0">{metadata?.title}</small>
          <small>
            Loc {location?.start.location + 1} / {count_of_location + 1} (
            {(location.start.percentage * 100).toFixed(2)}%)
          </small>
        </div>
      )}
    </div>
  );
}
