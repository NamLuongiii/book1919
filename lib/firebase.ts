"server-only";

import admin from "firebase-admin";
import { getApps, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

import * as dotenv from "dotenv";
dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
  universe_domain: "googleapis.com",
} as ServiceAccount;

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
