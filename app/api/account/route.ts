import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { accountSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
	const skip = parseInt(url.searchParams.get("skip") || "0", 10);

	const accounts = await db
		.collection("accounts")
		.find({})
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.toArray();

	return NextResponse.json(accounts);
}

export async function POST(req: NextRequest) {
	const db = await getDb();
	const json = await req.json();
	const parsed = accountSchema.safeParse({ ...json, createdAt: new Date(), updatedAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}

	const existing = await db.collection("accounts").findOne({ $or: [{ email: parsed.data.email }, { username: parsed.data.username }] });
	if (existing) {
		return NextResponse.json({ error: "Account with email or username already exists" }, { status: 409 });
	}

	const result = await db.collection("accounts").insertOne(parsed.data);
	return NextResponse.json({ _id: result.insertedId, ...parsed.data }, { status: 201 });
}
