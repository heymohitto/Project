import { MongoClient, Db, Collection } from "mongodb";

if (!process.env.MONGODB_URL) {
  throw new Error("Invalid/Missing environment variable: MONGODB_URL");
}

const uri = process.env.MONGODB_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

// Database and collections
export async function getDatabase(): Promise<Db> {
  const client = await clientPromise;
  return client.db("guns-lol-alt");
}

export async function getTemplatesCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection("templates");
}

export async function getAnalyticsCollection(): Promise<Collection> {
  const db = await getDatabase();
  return db.collection("analytics_events");
}