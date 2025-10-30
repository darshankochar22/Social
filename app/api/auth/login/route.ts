import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { signAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
	const { username, email, password } = await req.json().catch(() => ({}));
	if ((!username && !email) || !password) {
		return NextResponse.json({ error: "username or email, and password are required" }, { status: 400 });
	}
	const db = await getDb();
	const account = await db.collection("accounts").findOne({ $or: [{ username }, { email }] });
	if (!account || !account.passwordHash) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
	const ok = await bcrypt.compare(password, account.passwordHash);
	if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

	// ensure profile exists
	await db.collection("profiles").updateOne(
		{ accountId: String(account._id) },
		{ $setOnInsert: { accountId: String(account._id), displayName: account.username, createdAt: new Date(), updatedAt: new Date() } },
		{ upsert: true }
	);

	const token = signAuthToken({ accountId: String(account._id) });
	const res = NextResponse.json({ ok: true, account: { _id: account._id, username: account.username, email: account.email } });
	res.cookies.set("auth", token, { httpOnly: true, sameSite: "lax", path: "/" });
	return res;
}
