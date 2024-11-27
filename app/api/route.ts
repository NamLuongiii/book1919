import { CATEGORIES } from "@/lib/constant";
import { createIndex, searchElastic } from "@/lib/elasticsearch";
import { bucket, db, uploadFile } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { getDownloadURL } from "firebase-admin/storage";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";
import { Source } from "./documents/source";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const api = sp.get("api");
  const search = sp.get("search") || "";

  switch (api) {
    case "search":
      return apiSearchFile(request, search);
    case "create-index":
      return _createIndex(request);
    default:
      return api1(request);
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();

    const img = form.get("img");
    const name = form.get("name");
    const source = form.get("source");

    if (!img || !name || !source) throw new Error("400 error");

    // progressing file
    const file = img as File;
    const urls = await Promise.all([
      resizeAndUploadImage(file, 200, 300),
      resizeAndUploadImage(file, 60, 90),
      uploadFile(source as File),
    ]);

    const source_object: Source = {
      name: name as string,
      source: urls[2],
      image_200x300: urls[0],
      image_60x90: urls[1],
      createdAt: FieldValue.serverTimestamp(),
      position: CATEGORIES["Cate A"],
    };

    await db.collection("sources").add(source_object);

    const data = { message: "Create successfully" };
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }));
  }
}

const resizeAndUploadImage = async (file: File, w: number, h: number) => {
  const buffer = Buffer.from(await file.arrayBuffer());
  const to_buffer = await sharp(buffer)
    .resize(w, h, { fit: "contain" })
    .toBuffer();

  const gen_name = `${w}x${h}_${uuidv4()}_${file.name.replaceAll(" ", "_")}`;

  const _file = bucket.file(gen_name);
  await _file.save(to_buffer);
  return getDownloadURL(_file);
};

// api 1
const api1 = async (request: NextRequest) => {
  const public_path = path.join(process.cwd(), "/public");
  const url = path.join(public_path, "/table-of-content.png");

  const text = await fs.promises.readFile(
    path.join(process.cwd(), "app/api/text.txt"),
    "utf-8"
  );

  const data = await fs.promises.readFile(url);

  await sharp(data)
    .resize(50)
    .toFile(path.join(public_path, "table-of-content-100.png"));

  return new Response(JSON.stringify({ url: request.url }), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// api file search
const apiSearchFile = async (request: NextRequest, search: string) => {
  await searchElastic(search);
  return NextResponse.json({ message: "success" });
};

// create index elasticsearch
const _createIndex = async (request: NextRequest) => {
  await createIndex();

  return NextResponse.json({ message: "success" });
};
