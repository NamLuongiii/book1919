import { Source } from "@/app/api/documents/source";
import elasticsearch from "elasticsearch";
import { db } from "./firebase";

const indexName = "sources";
const typeName = "document";
var bonsai_url = process.env.BONSAI_URL;
var client = new elasticsearch.Client({
  host: bonsai_url,
  log: "trace",
});

// indexing
const createIndex = async () => {
  try {
    const snapshot = await db.collection(indexName).get();

    const tasks: Source[] = snapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Source)
    );

    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];

      await client.index({
        index: indexName,
        id: task.id,
        type: typeName,
        body: {
          name: task.name,
          image_60x90: task.image_60x90,
        },
      });
    }
  } catch (error) {
    console.error("Error in createIndex:", error);
  }
};

// search
const searchElastic = async (name: string) => {
  try {
    const data = await client.search({
      size: 10,
      index: indexName,
      type: typeName,
      body: {
        query: {
          match: {
            name: name,
          },
        },
      },
    });

    return data.hits.hits;
  } catch (error) {
    return error;
  }
};

export { createIndex, searchElastic };
