import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { profileSchema } from "@/lib/schemas";

export async function GET(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const accountId = url.searchParams.get("accountId");
	const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
	const skip = parseInt(url.searchParams.get("skip") || "0", 10);

	const filter: Record<string, unknown> = {};
	if (accountId) filter.accountId = accountId;

	const profiles = await db
		.collection("profiles")
		.find(filter)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.toArray();

	return NextResponse.json(profiles);
}

export async function POST(req: NextRequest) {
	const db = await getDb();
	const json = await req.json();
	const parsed = profileSchema.safeParse({ ...json, createdAt: new Date(), updatedAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}

	const existing = await db.collection("profiles").findOne({ accountId: parsed.data.accountId });
	if (existing) {
		return NextResponse.json({ error: "Profile for account already exists" }, { status: 409 });
	}

	const result = await db.collection("profiles").insertOne(parsed.data);
	return NextResponse.json({ _id: result.insertedId, ...parsed.data }, { status: 201 });
}
