import { connectToDatabase } from "../../lib/mongodb"; // MongoDB bağlantısı için yeni yapı
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const { db } = await connectToDatabase(); // Get the db object directly
        const countries = await db.collection('countries').find({}).toArray();
        return NextResponse.json(countries);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: error.message });
    }
}