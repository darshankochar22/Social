import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getAccountIdFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
	const accountId = getAccountIdFromRequest(req);
	if (!accountId || !ObjectId.isValid(accountId)) {
		return NextResponse.json({ account: null });
	}
	const db = await getDb();
	const account = await db.collection("accounts").findOne({ _id: new ObjectId(accountId) }, { projection: { passwordHash: 0 } });
	if (!account) return NextResponse.json({ account: null });
	return NextResponse.json({ account: { _id: String(account._id), username: account.username, email: account.email } });
}
