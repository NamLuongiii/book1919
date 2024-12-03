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

export { getFullPath, isRelative };
