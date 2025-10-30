import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { profileSchema } from "@/lib/schemas";
import { ObjectId } from "mongodb";

// Helper to robustly unwrap params from context
async function unwrapParams(ctx: any) {
  if (ctx?.params && typeof ctx.params.then === 'function') {
    return await ctx.params;
  }
  return ctx.params;
}

export async function GET(_req: NextRequest, ctx: any) {
  const params = await unwrapParams(ctx);
  const db = await getDb();
  const id = params.id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const profile = await db.collection("profiles").findOne({ _id: new ObjectId(id) });
  if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest, ctx: any) {
  const params = await unwrapParams(ctx);
  const db = await getDb();
  const id = params.id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  const json = await req.json();
  const parsed = profileSchema.partial().safeParse({ ...json, updatedAt: new Date() });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  await db.collection("profiles").updateOne({ _id: new ObjectId(id) }, { $set: parsed.data });
  const updated = await db.collection("profiles").findOne({ _id: new ObjectId(id) });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, ctx: any) {
  const params = await unwrapParams(ctx);
  const db = await getDb();
  const id = params.id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  await db.collection("profiles").deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
