import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(); // uses db name from URI
    const items = await db.collection("testing").find({}).sort({ _id: -1 }).toArray();
    return Response.json({ ok: true, items });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const doc = {
      name: body?.name ?? "test",
      createdAt: new Date(),
    };

    const result = await db.collection("testing").insertOne(doc);

    return Response.json({ ok: true, insertedId: result.insertedId });
  } catch (e) {
    return Response.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
