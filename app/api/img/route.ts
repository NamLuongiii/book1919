import path from "path";
import sharp from "sharp";

export async function POST(request: Request) {
  const form_data = await request.formData();

  const img = form_data.get("img");

  if (img) {
    const file = img as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    await sharp(buffer)
      .trim()
      .toFile(path.join(process.cwd(), "public", file.name));
  }

  return new Response("Hello Worl Img");
}
