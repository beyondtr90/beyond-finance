import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { userId } = body;

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        const userDetails = await db.collection("users").findOne(
            { user_id: userId },
        );

        if (!userDetails || userDetails.length === 0) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }


        return NextResponse.json({
            balance: userDetails.balance,
            blocked_amount: userDetails.blocked_amount,
        });
    } catch (error) {
        console.error("Error fetching user balance:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
