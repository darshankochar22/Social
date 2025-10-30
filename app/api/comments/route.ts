import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { commentSchema } from "@/lib/schemas";
import { getAccountIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const targetType = url.searchParams.get("targetType");
	const targetId = url.searchParams.get("targetId");
    const countOnly = url.searchParams.get("count") === "1";
	const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
	const skip = parseInt(url.searchParams.get("skip") || "0", 10);

	const filter: Record<string, unknown> = {};
	if (targetType) filter.targetType = targetType;
	if (targetId) filter.targetId = targetId;

    if (countOnly) {
        const count = await db.collection("comments").countDocuments(filter);
        return NextResponse.json({ count });
    }

	const comments = await db
		.collection("comments")
		.find(filter)
		.sort({ createdAt: -1 })
		.skip(skip)
		.limit(limit)
		.toArray();

	return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
	const db = await getDb();
	const json = await req.json();
	const accountId = json.accountId || getAccountIdFromRequest(req);
	const payload = { ...json, accountId, createdAt: new Date(), updatedAt: new Date() };
	const parsed = commentSchema.safeParse(payload);
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	const result = await db.collection("comments").insertOne(parsed.data);
	return NextResponse.json({ _id: result.insertedId, ...parsed.data }, { status: 201 });
}
