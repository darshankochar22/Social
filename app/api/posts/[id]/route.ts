import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { postSchema } from "@/lib/schemas";
import { ObjectId } from "mongodb";

async function unwrapParams(ctx: any) {
	if (ctx?.params && typeof ctx.params.then === 'function') {
		return await ctx.params;
	}
	return ctx.params;
}

export async function GET(_req: NextRequest, ctx: any) {
	const db = await getDb();
	const { id } = await unwrapParams(ctx);
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });
	if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
	return NextResponse.json(post);
}

export async function PUT(req: NextRequest, ctx: any) {
	const db = await getDb();
	const { id } = await unwrapParams(ctx);
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	const json = await req.json();
	const parsed = postSchema.partial().safeParse({ ...json, updatedAt: new Date() });
	if (!parsed.success) {
		return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
	}
	await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
	const updated = await db.collection("posts").findOne({ _id: new ObjectId(id) });
	return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: any) {
	const db = await getDb();
	const { id } = await unwrapParams(ctx);
	if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
	await db.collection("posts").deleteOne({ _id: new ObjectId(id) });
	return NextResponse.json({ ok: true });
}
