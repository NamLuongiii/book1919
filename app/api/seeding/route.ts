import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { Source } from "../documents/source";

// Create Sources
export async function GET(request: Request) {
  try {
    const sources: Source[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((name) => ({
      name: name + "",
      image_60x90:
        "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/60x90_71d136eb-3680-49fb-9efe-4b910a9856b9_Screenshot_from_2024-11-12_10-48-44.png?alt=media&token=b1b11032-fcc3-4762-b6f6-d86f139ac2b2",
      image_200x300:
        "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/200x300_010c215e-c5dd-48b8-b838-82f279691f2d_Screenshot_from_2024-11-12_10-48-44.png?alt=media&token=3df6eaa0-8e6e-43d5-b7d9-7b98c5d64aaf",
      source:
        "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/Screenshot%20from%202024-11-18%2010-07-08.png?alt=media&token=3441c229-b0e5-4486-ae95-9e823a77aab8",
      createdAt: FieldValue.serverTimestamp(),
    }));

    for (let i = 0; i < sources.length; i++) {
      const element = sources[i];
      await db.collection("sources").add(element);
    }

    return new Response("success");
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }));
  }
}
