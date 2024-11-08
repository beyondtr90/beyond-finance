import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { investmentType } = await request.json();
        const { db } = await connectToDatabase();

        const result = await db.collection("funds").findOne({
            "funds.id": investmentType
        });

        if (result) {
            const fundDetails = result.funds.find(fund => fund.id === investmentType);

            return NextResponse.json({
                success: true,
                fundDetails,
                message: "Fund details found",
            }, { status: 200 });
        } else {
            return NextResponse.json({
                success: false,
                message: "No fund investment found",
            }, { status: 404 });
        }
    } catch (error) {
        console.error("Error in POST handler:", error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
