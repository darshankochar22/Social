import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { getAccountIdFromRequest } from "@/lib/auth";

// GET /api/follow?followerId=&followeeId=&count=1
// GET /api/follow/stats?accountId= -> followers/following counts
export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const pathname = url.pathname;
	const db = await getDb();

	if (pathname.endsWith("/stats")) {
		const accountId = url.searchParams.get("accountId");
		if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });
		const followers = await db.collection("follows").countDocuments({ followeeId: accountId });
		const following = await db.collection("follows").countDocuments({ followerId: accountId });
		return NextResponse.json({ followers, following });
	}

	const followerId = url.searchParams.get("followerId");
	const followeeId = url.searchParams.get("followeeId");
	const countOnly = url.searchParams.get("count") === "1";
	const filter: Record<string, unknown> = {};
	if (followerId) filter.followerId = followerId;
	if (followeeId) filter.followeeId = followeeId;
	if (countOnly) {
		const count = await db.collection("follows").countDocuments(filter);
		return NextResponse.json({ count });
	}
	const rows = await db.collection("follows").find(filter).toArray();
	return NextResponse.json(rows);
}

// POST /api/follow { followeeId }
export async function POST(req: NextRequest) {
	const db = await getDb();
	const body = await req.json().catch(() => ({}));
	let followerId = body.followerId || getAccountIdFromRequest(req);
	const followeeId = body.followeeId;
	if (!followerId || !followeeId) return NextResponse.json({ error: "followerId and followeeId required" }, { status: 400 });
	if (followerId === followeeId) return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
	const exists = await db.collection("follows").findOne({ followerId, followeeId });
	if (exists) return NextResponse.json(exists, { status: 200 });
	const doc = { followerId, followeeId, createdAt: new Date() };
	const result = await db.collection("follows").insertOne(doc);
	return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
}

// DELETE /api/follow?followeeId=&followerId=
export async function DELETE(req: NextRequest) {
	const db = await getDb();
	const url = new URL(req.url);
	let followerId = url.searchParams.get("followerId") || getAccountIdFromRequest(req);
	const followeeId = url.searchParams.get("followeeId");
	if (!followerId || !followeeId) return NextResponse.json({ error: "followerId and followeeId required" }, { status: 400 });
	await db.collection("follows").deleteOne({ followerId, followeeId });
	return NextResponse.json({ ok: true });
}
