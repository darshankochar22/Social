import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
	const url = new URL(req.url);
	const username = url.searchParams.get("username");
	const email = url.searchParams.get("email");
	if (!username && !email) return NextResponse.json({ error: "username or email required" }, { status: 400 });
	const db = await getDb();
	const query: any = { $or: [] as any[] };
	if (username) query.$or.push({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
	if (email) query.$or.push({ email });
	const account = await db.collection("accounts").findOne(query, { projection: { passwordHash: 0 } });
	if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json({ account: { _id: String(account._id), username: account.username, email: account.email } });
}
