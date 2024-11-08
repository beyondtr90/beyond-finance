import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";
import { encrypt, decrypt } from "../auth/route";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { userId, fundId, price } = await request.json();
    const { db } = await connectToDatabase();

    const user = await db.collection("users").findOne({ user_id: userId });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.balance - user.blocked_amount >= price) {
      // Kullanıcının bakiyesini güncelle
      await db
        .collection("users")
        .updateOne(
          { user_id: userId },
          { $inc: { balance: -price }, $set: { investment_type: fundId } }
        );
      // currentDate
      const timeResponse = await fetch(
        "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul"
      );
      const timeData = await timeResponse.json();

      const currentDate = new Date(timeData.dateTime);
      const formattedDate = currentDate.toISOString();

      const newInvestment = {
        user_id: userId,
        fund_id: fundId,
        created_at: formattedDate,
      };

      const result = await timeResponse
        .collection("fund_investments")
        .insertOne(newInvestment);

      const cookieStore = cookies();
      const sessionCookie = cookieStore.get("session");

      if (!sessionCookie) {
        return NextResponse.json({
          success: true,
          message: "Purchase success, but session not found",
        });
      }

      const session = await decrypt(sessionCookie.value);
      session.user.balance -= price;
      session.user.investment_type = fundId;

      const expires = new Date(Date.now() + 60 * 60 * 3 * 1000);
      const newSession = await encrypt({ user: session.user, expires });

      const response = NextResponse.json({
        success: true,
        message: "Purchase success, session updated",
      });
      response.cookies.set("session", newSession, { expires, httpOnly: true });

      return response;
    } else {
      return NextResponse.json({ success: false, message: "Low balance" });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
