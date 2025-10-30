import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
	const { username, email, password } = await req.json().catch(() => ({}));
	if (!username || !email || !password) {
		return NextResponse.json({ error: "username, email, password are required" }, { status: 400 });
	}
	const db = await getDb();
	const dupe = await db.collection("accounts").findOne({ $or: [{ username }, { email }] });
	if (dupe) return NextResponse.json({ error: "Username or email already exists" }, { status: 409 });

	const passwordHash = await bcrypt.hash(password, 10);
	const doc = { username, email, passwordHash, createdAt: new Date(), updatedAt: new Date() };
	const result = await db.collection("accounts").insertOne(doc);
	const accountId = String(result.insertedId);

	// ensure profile
	await db.collection("profiles").updateOne(
		{ accountId },
		{ $setOnInsert: { accountId, displayName: username, createdAt: new Date(), updatedAt: new Date() } },
		{ upsert: true }
	);

	const token = signAuthToken({ accountId });
	const res = NextResponse.json({ ok: true, account: { _id: accountId, username, email } }, { status: 201 });
	res.cookies.set("auth", token, { httpOnly: true, sameSite: "lax", path: "/" });
	return res;
}
