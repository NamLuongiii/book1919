"server-only";

import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
var serviceAccount = require("./fb-key.json");

if (!admin.app.length)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "gs://app-2024-63e00.firebasestorage.app",
  });

export const db = getFirestore();
export const bucket = getStorage().bucket(
  "gs://app-2024-63e00.firebasestorage.app"
);

export const uploadFile = async (file: File) => {
  const _file = bucket.file(file.name);
  await _file.save(Buffer.from(await file.arrayBuffer()));
  return getDownloadURL(_file);
};
