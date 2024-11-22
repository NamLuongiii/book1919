import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

const image_60x90 =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/60x90_71d136eb-3680-49fb-9efe-4b910a9856b9_Screenshot_from_2024-11-12_10-48-44.png?alt=media&token=b1b11032-fcc3-4762-b6f6-d86f139ac2b2";
const image_200x300 =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/Screenshot%20from%202024-11-18%2010-07-08.png?alt=media&token=3441c229-b0e5-4486-ae95-9e823a77aab8";
const source =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/Screenshot%20from%202024-11-18%2010-07-08.png?alt=media&token=3441c229-b0e5-4486-ae95-9e823a77aab8";

// Create Sources
export async function GET(request: Request) {
  try {
    for (let i = 0; i < 100; i++) {
      await db.collection("sources").add({
        name: "Number " + i,
        image_60x90,
        image_200x300,
        source,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return new Response("success");
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }));
  }
}
