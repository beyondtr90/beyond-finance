import { connectToDatabase } from "../../lib/mongodb"; 
import { NextResponse } from "next/server";
import { encrypt, decrypt } from "../auth/route";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const {
      userId,
      amount,
      investmentName,
      dailyReturn,
      quantifyNumber,
      requiredInvitations,
      invitationCode,
    } = await request.json();

    const { db } = await connectToDatabase();

    // Fetch user balance and blocked_amount from the users table
    const user = await db.collection("users").findOne({ user_id: userId });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const availableBalance = user.balance - user.blocked_amount;
    if (availableBalance < amount) {
      return NextResponse.json({
        success: false,
        message: `Yetersiz bakiye! Girdiğiniz tutar için kullanılabilir ${amount} gereklidir. Mevcut kullanılabilir bakiye: ${availableBalance}.`,
      }, { status: 400 });
    }

    // Check if the user already has an investment
    const existingInvestment = await db.collection("term_investments").findOne({ user_id: userId });
    if (existingInvestment || user.investment_type != null) {
      return NextResponse.json({
        success: false,
        message: "Aktif bir yatırıma sahipsiniz",
      }, { status: 400 });
    }
    

    // Fetch the number of invitations related to the invitationCode
    const numberOfInvitations = await db.collection("users").countDocuments({ reference_owner: invitationCode });

    if (numberOfInvitations < requiredInvitations) {
      return NextResponse.json({
        success: false,
        message: `Yetersiz davet sayısı! ${investmentName} yatırımı için en az ${requiredInvitations} davet gerekir. Şu anki davet sayınız: ${numberOfInvitations}.`,
      }, { status: 400 });
    }

    // endDate Calculator
    const timeResponse = await fetch("https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul");
    const timeData = await timeResponse.json();

    const currentDate = new Date(timeData.dateTime);
    currentDate.setDate(currentDate.getDate() + 7);
    const formattedEndDate = currentDate.toISOString();

    // Investment Credentials
    const newInvestment = {
      user_id: userId,
      investment_level: investmentName,
      amount: parseFloat(amount),
      daily_return: dailyReturn,
      quantify_number: quantifyNumber,
      left_quantify_number: quantifyNumber,
      end_date: formattedEndDate,
      number_of_invitation: numberOfInvitations,
      invitation_code: invitationCode,
      created_at: currentDate,
    };

    const result = await db.collection("term_investments").insertOne(newInvestment);
    const updateUser = await db.collection("users").updateOne({ user_id: userId }, { $set: { blocked_amount: user.blocked_amount + parseFloat(amount), investment_type: investmentName } });

    // Handle session
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ success: true, message: "Purchase success, but session not found" });
    }

    const session = await decrypt(sessionCookie.value);
    session.user.investment_type = investmentName;

    const expires = new Date(Date.now() + 60 * 60 * 3 * 1000);
    const newSession = await encrypt({ user: session.user, expires });
    
    const response = NextResponse.json({ success: true, message: "Purchase success, session updated" });
    response.cookies.set("session", newSession, { expires, httpOnly: true });
    return new Response(JSON.stringify({ success: true, message: "Investment recorded successfully", investmentId: result.insertedId }), {
        status: 201,
        headers: {
            "Set-Cookie": `session=${newSession}; Path=/; Expires=${expires.toUTCString()}; HttpOnly`,
            "Content-Type": "application/json"
        }
    });
    
  } catch (error) {
    console.error("Error in POST /api/termPurchase:", error);
    return NextResponse.json({
      success: false,
      message: "Error recording investment",
      error: error.message,
    }, { status: 500 });
  }
}
