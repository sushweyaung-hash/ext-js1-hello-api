import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

function isValidObjectId(id) {
  return ObjectId.isValid(id);
}

export async function GET(_request, ctx) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) {
      return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const item = await db.collection("item").findOne({ _id: new ObjectId(id) });

    if (!item) return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    return Response.json({ ok: true, item });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function PUT(request, ctx) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) {
      return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const body = await request.json();
    const update = {
      itemName: String(body.itemName || "").trim(),
      itemCategory: String(body.itemCategory || "").trim(),
      itemPrice: Number(body.itemPrice),
      status: String(body.status || "").trim(),
      updatedAt: new Date(),
    };

    if (!update.itemName || !update.itemCategory || Number.isNaN(update.itemPrice) || !update.status) {
      return Response.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("item").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function DELETE(_request, ctx) {
  try {
    const { id } = await ctx.params;
    if (!isValidObjectId(id)) {
      return Response.json({ ok: false, error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("item").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return Response.json({ ok: false, error: "Not found" }, { status: 404 });
    }

    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
