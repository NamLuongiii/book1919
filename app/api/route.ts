import fs from "fs";
import path from "path";
import sharp from "sharp";

export async function GET(request: Request) {
  const public_path = path.join(process.cwd(), "/public");
  const url = path.join(public_path, "/table-of-content.png");

  const text = await fs.promises.readFile(
    path.join(process.cwd(), "app/api/text.txt"),
    "utf-8"
  );

  console.log(text);

  const data = await fs.promises.readFile(url);

  await sharp(data)
    .resize(50)
    .toFile(path.join(public_path, "table-of-content-100.png"));

  return new Response(JSON.stringify({ url: request.url }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    await new Promise((rel, rej) => {
      setTimeout(() => {
        rel(null);
      }, 2000);
    });

    const img = form.get("img");

    if (img) {
      const file = img as File;
      const array_buffer = await file.arrayBuffer();
      const buffer = Buffer.from(array_buffer);

      await Promise.all([
        sharp(buffer)
          .resize(50)
          .toFile(path.join(process.cwd(), "public", `50_${file.name}`)),
        sharp(buffer)
          .resize(100)
          .toFile(path.join(process.cwd(), "public", `100_${file.name}`)),
      ]);

      await fs.promises.writeFile(
        path.join(process.cwd(), "public", file.name),
        buffer
      );
    }

    return new Response("hello world");
  } catch (error) {
    return new Response(JSON.stringify(error));
  }
}
