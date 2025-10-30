import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { accountSchema } from "@/lib/schemas";
import { ObjectId } from "mongodb";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	const db = await getDb();
	const id = params.id;
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const account = await db.collection("accounts").findOne({ _id: new ObjectId(id) });
	if (!account) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(account);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
	const db = await getDb();
	const id = params.id;
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const json = await req.json();
	const parsed = accountSchema.partial().safeParse({ ...json, updatedAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	await db.collection("accounts").updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
	const updated = await db.collection("accounts").findOne({ _id: new ObjectId(id) });
	return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
	const db = await getDb();
	const id = params.id;
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	await db.collection("accounts").deleteOne({ _id: new ObjectId(id) });
	return NextResponse.json({ ok: true });
}
