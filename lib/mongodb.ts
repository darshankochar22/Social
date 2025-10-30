import { MongoClient, Db } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
	if (cachedDb && cachedClient) return cachedDb;

	const uri = process.env.MONGODB_URI;
	if (!uri) {
		throw new Error("MONGODB_URI is not set in environment variables");
	}

	const client = new MongoClient(uri);
	await client.connect();

	const dbName = process.env.MONGODB_DB || new URL(uri).pathname.replace(/^\//, "") || "hackcbs";
	const db = client.db(dbName);

	cachedClient = client;
	cachedDb = db;
	return db;
}
