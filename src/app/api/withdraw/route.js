import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId, amount, address} = await request.json();
    const { db } = await connectToDatabase();

    // Kullanıcıyı kontrol et
    const user = await db.collection("users").findOne({ user_id: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    const availableBalance = user.balance - user.blocked_amount ;
    const formattedAmount = parseFloat(Number(amount).toFixed(2));

    if (formattedAmount > availableBalance){
        return NextResponse.json({ success: false, message: "Yetersiz kullanılabilir bakiye!"}, {status: 401 });
    }
    const newBalance = user.balance - formattedAmount ;

    await db.collection("users").updateOne(
      { user_id: userId },
      { $set: { balance: newBalance } }
    );

    const response = await fetch(
        "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul"
      );
      const timeData = await response.json();
      const createdAt = timeData.dateTime;
  
      await db.collection("requests").insertOne({
        user_id: userId,
        phone: user.phone,
        amount: formattedAmount,
        user_balance: user.balance,
        address: address,
        created_at: createdAt,
      });

    return NextResponse.json({ success: true, message: "Çekim başarıyla sıraya alındı" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
