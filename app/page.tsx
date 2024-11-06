"use client";

import Epub from "epubjs";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Load the opf
    var book = Epub("https://s3.amazonaws.com/moby-dick/OPS/package.opf");
    var rendition = book.renderTo("viewer", {
      width: "100%",
      height: 600,
      ignoreClass: "annotator-hl",
      flow: "scrolled",
    });

    rendition.themes.fontSize("140%");

    var displayed = rendition.display(3);

    // Navigation loaded
    book.loaded.navigation.then(function (toc) {
      // console.log(toc);
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
    <div>
      <div id="viewer"></div>
      <div id="prev">Prev</div>
      <div id="next">Next</div>
    </div>
  );
}
