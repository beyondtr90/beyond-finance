import { connectToDatabase } from "../../../lib/mongodb";

export async function POST(req) {
  const { user_id, phone, amount, address } = await req.json();

  try {
    const { db } = await connectToDatabase();
    const formattedAmount = parseFloat(Number(amount).toFixed(2));
    const timeResponse = await fetch(
      "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul"
    );
    const timeData = await timeResponse.json();

    const currentDate = new Date(timeData.dateTime);
    const formattedDate = currentDate.toISOString();

    // INSERT WITHDRAWALS
    await db.collection("withdrawals").insertOne({
      user_id,
      phone,
      amount: formattedAmount,
      status: "Reddedildi",
      address,
      created_at: formattedDate,
    });

    // Get the current user balance
    const user = await db.collection("users").findOne({ user_id });
    if (!user) {
      throw new Error("User  not found");
    }

    const currentBalance = parseFloat(user.user_balance);
    const updatedBalance = currentBalance + formattedAmount;

    // UPDATE USERS - Set the new balance
    const updateResult = await db
      .collection("users")
      .updateOne({ user_id }, { $set: { user_balance: updatedBalance } });

    if (!updateResult.acknowledged) {
      console.error("Failed to update user balance:", updateResult);
      throw new Error("Failed to update user balance");
    }

    // DELETE REQUEST
    const deleteResult = await db.collection("requests").deleteOne({ user_id });

    if (!deleteResult.acknowledged) {
      console.error("Failed to delete request:", deleteResult);
      throw new Error("Failed to delete request");
    }

    return new Response(
      JSON.stringify({
        message: "Data successfully inserted, updated, and deleted",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in POST function:", error);
    return new Response(
      JSON.stringify({ msg: "An error occurred.", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
