import { connectToDatabase } from "../../lib/mongodb"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Fetch all term investments
    const investments = await db.collection("term_investments").find().toArray();

    if (investments.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No investments found",
      }, { status: 404 });
    }

    const updatePromises = investments.map(async (investment) => {
      let updatedQuantifyNumber = 0;

      if (investment.investment_level === "Starter") {
        updatedQuantifyNumber = 3;
      } else if (investment.investment_level === "Mid") {
        updatedQuantifyNumber = 4;
      } else if (investment.investment_level === "Pro") {
        updatedQuantifyNumber = 5;
      }

      // Update the investment in the database
      await db.collection("term_investments").updateOne(
        { _id: investment._id },
        { $set: { left_quantify_number: updatedQuantifyNumber } }
      );
    });

    // Wait for all updates to complete
    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: "Left quantify numbers updated based on investment level",
    }, { status: 200 });
  } catch (error) {
    console.error("Error updating investments:", error);
    return NextResponse.json({
      success: false,
      message: "Error updating investments",
      error: error.message,
    }, { status: 500 });
  }
}
