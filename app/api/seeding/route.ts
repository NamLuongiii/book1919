import { CATEGORIES } from "@/lib/constant";
import { db } from "@/lib/firebase";
import { FieldValue } from "firebase-admin/firestore";

const image_60x90 =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/200x300_09afe10b-6859-4e0e-9061-05c3ffda15a0_21364411.jpg?alt=media&token=c81a705a-8a28-4c22-bde9-422f405451d2";
const image_200x300 =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/200x300_09afe10b-6859-4e0e-9061-05c3ffda15a0_21364411.jpg?alt=media&token=c81a705a-8a28-4c22-bde9-422f405451d2";
const source =
  "https://firebasestorage.googleapis.com/v0/b/app-2024-63e00.firebasestorage.app/o/Harry%20Potter%20-%20J.%20K.%20Rowling.epub?alt=media&token=ffafac1f-ed65-4779-b0f9-bd370dfd1ce2";

// Create Sources
export async function GET(request: Request) {
  try {
    for (let i = 0; i < 100; i++) {
      await db.collection("sources").add({
        name: "Number " + i,
        image_60x90,
        image_200x300,
        source,
        position: CATEGORIES["Cate A"],
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return new Response("success");
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message }));
  }
}
