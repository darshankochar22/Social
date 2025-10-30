import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const accountId = url.searchParams.get("accountId");
  if (!accountId) return NextResponse.json({ error: "accountId required" }, { status: 400 });
  const db = await getDb();
  const followers = await db.collection("follows").countDocuments({ followeeId: accountId });
  const following = await db.collection("follows").countDocuments({ followerId: accountId });
  return NextResponse.json({ followers, following });
}
