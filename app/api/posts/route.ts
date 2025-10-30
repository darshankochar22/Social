import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { postSchema } from "@/lib/schemas";
import { getAccountIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const accountId = url.searchParams.get("accountId");
	const tag = url.searchParams.get("tag");
	const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
	const skip = parseInt(url.searchParams.get("skip") || "0", 10);

	const filter: Record<string, unknown> = {};
	if (accountId) filter.accountId = accountId;
	if (tag) filter.tags = tag;

	const posts = await db
		.collection("posts")
		.find(filter)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.toArray();

	return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
	const db = await getDb();
	const json = await req.json();
	const accountId = json.accountId || getAccountIdFromRequest(req);
	const parsed = postSchema.safeParse({ ...json, accountId, createdAt: new Date(), updatedAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}

	const result = await db.collection("posts").insertOne(parsed.data);
	return NextResponse.json({ _id: result.insertedId, ...parsed.data }, { status: 201 });
}
