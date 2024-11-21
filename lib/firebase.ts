"server-only";

import admin from "firebase-admin";
import { getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";
var serviceAccount = require("./fb-key.json");

const yourFirebaseAdminConfig = {
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://app-2024-63e00.firebasestorage.app",
};

const alreadyCreatedAps = getApps();

const App =
  alreadyCreatedAps.length === 0
    ? initializeApp(yourFirebaseAdminConfig, "app name")
    : alreadyCreatedAps[0];

export const db = getFirestore(App);
export const bucket = getStorage(App).bucket(
  "gs://app-2024-63e00.firebasestorage.app"
);

export const uploadFile = async (file: File) => {
  const _file = bucket.file(file.name);
  await _file.save(Buffer.from(await file.arrayBuffer()));
  return getDownloadURL(_file);
};
