import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { likeSchema } from "@/lib/schemas";
import { getAccountIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const targetType = url.searchParams.get("targetType");
	const targetId = url.searchParams.get("targetId");
	const accountId = url.searchParams.get("accountId");
	const countOnly = url.searchParams.get("count") === "1";

	const filter: Record<string, unknown> = {};
	if (targetType) filter.targetType = targetType;
	if (targetId) filter.targetId = targetId;
	if (accountId) filter.accountId = accountId;

	if (countOnly && targetType && targetId) {
		const count = await db.collection("likes").countDocuments({ targetType, targetId });
		return NextResponse.json({ count });
	}

	const likes = await db.collection("likes").find(filter).toArray();
	return NextResponse.json(likes);
}

export async function POST(req: NextRequest) {
	const db = await getDb();
	const json = await req.json();
	const accountId = json.accountId || getAccountIdFromRequest(req);
	const parsed = likeSchema.safeParse({ ...json, accountId, createdAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}

	const exists = await db.collection("likes").findOne({
		targetType: parsed.data.targetType,
		targetId: parsed.data.targetId,
		accountId: parsed.data.accountId,
	});
	if (exists) return NextResponse.json(exists, { status: 200 });

	const result = await db.collection("likes").insertOne(parsed.data);
	return NextResponse.json({ _id: result.insertedId, ...parsed.data }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	const targetType = url.searchParams.get("targetType");
	const targetId = url.searchParams.get("targetId");
	let accountId = url.searchParams.get("accountId");
	if (!accountId) accountId = getAccountIdFromRequest(req) || undefined as any;
	if (!targetType || !targetId || !accountId) return NextResponse.json({ error: "Missing params" }, { status: 400 });
	await db.collection("likes").deleteOne({ targetType, targetId, accountId });
	return NextResponse.json({ ok: true });
}
