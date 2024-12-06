// Convert path from ralative to full path:
// exp: abc.png => OEBPS/abc.png
// ../STYLES/index.css => STYLES/index.css
function getFullPath(path: string, relative_path: string) {
  const is_absolute_path = false;

  if (is_absolute_path) return path;

  const levels = relative_path.split("/");
  levels.pop();

  if (levels.length && levels[levels?.length - 1] == "/") {
    levels.pop();
  }

  let full_path = "";
  path.split("/").forEach((segment) => {
    switch (segment) {
      case "..":
        levels.pop();
        break;
      case ".":
      case "":
        break;
      default:
        full_path += "/" + segment;
        break;
    }
  });

  return levels.join("/") + full_path;
}

function isRelative(path: string) {
  return !path.startsWith("http://") && !path.startsWith("https://");
}

function parse(path: string, base: string) {
  // ../../../../abc
  // ./abc
  // abc
  // /abc

  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  // search param
  // hash
  let hash = undefined;
  let search = undefined;
  let _path = path;

  if (path.includes("#")) {
    const s = path.split("#");
    hash = s.pop();
    _path = s.join();
  }

  if (path.includes("?")) {
    const s = _path?.split("?");
    search = s[1];
    _path = s.join();
  }

  if (base.includes("#") || base.includes("?")) throw "invalid base url";

  const s = _path.split("/");
  const b_s = base.split("/");
  b_s.pop();

  for (let i = 0; i < s.length; i++) {
    const segment = s[i];

    switch (segment) {
      case "..":
        b_s.pop();
        break;
      case ".":
      case "":
        break;
      default:
        b_s.push(segment);
        break;
    }
  }

  return {
    path: b_s.join("/"),
    hash,
    search,
  };
}

export { getFullPath, isRelative, parse };
