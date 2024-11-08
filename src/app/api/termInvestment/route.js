import { connectToDatabase } from "../../lib/mongodb"; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const investmentDetails = await db.collection("term_investments").findOne(
      { user_id: userId }, 
    );

    if (!investmentDetails || investmentDetails === null) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "No investments found for this user",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Investment found",
        investmentDetails: investmentDetails,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
