import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    const collection = db.collection("funds");

    const funds = await collection.find({}).toArray();

    return NextResponse.json(funds);
  } catch (error) {
    console.error("Error fetching funds:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
