import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const q = (url.searchParams.get("q") || "").trim();
	const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 50);
	if (!q) return NextResponse.json({ results: [] });
	const db = await getDb();
	const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

	// search accounts by username
	const accounts = await db.collection("accounts").find({ username: { $regex: regex } }, { projection: { passwordHash: 0 } }).limit(limit).toArray();
	// search profiles by displayName
	const profiles = await db.collection("profiles").find({ displayName: { $regex: regex } }).limit(limit).toArray();

	// merge by accountId
	const accountIdToRes: Record<string, any> = {};
	for (const a of accounts) {
		accountIdToRes[String(a._id)] = { accountId: String(a._id), username: a.username };
	}
	for (const p of profiles) {
		const id = String(p.accountId);
		accountIdToRes[id] = { ...(accountIdToRes[id] || { accountId: id }), displayName: p.displayName || null, avatarUrl: p.avatarUrl || null };
	}

	// backfill usernames for entries lacking one
	const missingIds = Object.values(accountIdToRes).filter((r:any) => !r.username).map((r:any) => r.accountId);
	if (missingIds.length) {
		const backfill = await db.collection("accounts").find({ _id: { $in: missingIds.map((id:string) => new (require('mongodb').ObjectId)(id)) } }, { projection: { username: 1 } }).toArray();
		for (const a of backfill) {
			const id = String(a._id);
			if (accountIdToRes[id]) accountIdToRes[id].username = a.username;
		}
	}

	const results = Object.values(accountIdToRes).slice(0, limit);
	return NextResponse.json({ results });
}
