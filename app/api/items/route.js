import clientPromise from "@/lib/mongodb";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, parseInt(searchParams.get("limit") || "5", 10));
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db();
    const col = db.collection("item");

    const total = await col.countDocuments({});
    const items = await col.find({}).sort({ _id: -1 }).skip(skip).limit(limit).toArray();

    return Response.json({
      ok: true,
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),

      items,
    });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const item = {
      itemName: String(body.itemName || "").trim(),
      itemCategory: String(body.itemCategory || "").trim(),
      itemPrice: Number(body.itemPrice),
      status: String(body.status || "active").trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!item.itemName || !item.itemCategory || Number.isNaN(item.itemPrice) || !item.status) {
      return Response.json({ ok: false, error: "Invalid input" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("item").insertOne(item);

    return Response.json({ ok: true, insertedId: result.insertedId });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
