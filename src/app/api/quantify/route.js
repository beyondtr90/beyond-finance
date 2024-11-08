"use server";
import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";
import { SignJWT } from "jose"; // JWT şifreleme için jose kütüphanesini içe aktarın

const secretKey = process.env.JWT_AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function POST(req) {
  try {
    // Bekleme süresi fonksiyonu
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const body = await req.json();
    const {
      userId,
      amount,
      quantifyNumber,
      leftQuantifyNumber,
      dailyReturn,
    } = body;

    const { db } = await connectToDatabase();

    if (leftQuantifyNumber > 0) {
      const dailyIncrement = (dailyReturn / 100) * amount;
      const incrementPerRequest = parseFloat((dailyIncrement / quantifyNumber).toFixed(2)); 
      const updatedAmount = parseFloat((parseFloat(amount) + incrementPerRequest).toFixed(2)); 

      const userUpdateResult = await db.collection('users').updateOne(
        { user_id: userId },
        {
          $inc: {
            blocked_amount: parseFloat(incrementPerRequest.toFixed(2)), // Yuvarla
            balance: parseFloat(incrementPerRequest.toFixed(2)), // Yuvarla
            daily_earning: parseFloat(incrementPerRequest.toFixed(2)), // Yuvarla
            total_earning: parseFloat(incrementPerRequest.toFixed(2)), // Yuvarla
          },
        }
      );

      if (userUpdateResult.matchedCount === 0) {
        return NextResponse.json(
          { error: "Kullanıcı bulunamadı veya güncelleme başarısız" },
          { status: 404 }
        );
      }

      // Kullanıcıyı yeniden al ve oturumunu güncelle
      const updatedUser  = await db.collection('users').findOne({ user_id: userId });
      const expires = new Date(Date.now() + 60 * 60 * 3 * 1000); // 3 saat geçerli
      const session = await encrypt({ user: updatedUser , expires });

      // term_investments güncelleme
      const termUpdateResult = await db.collection('term_investments').updateOne(
        { user_id: userId },
        { $inc: { left_quantify_number: -1 } }
      );

      if (termUpdateResult.matchedCount === 0) {
        return NextResponse.json(
          { error: "Term investment bulunamadı veya güncelleme başarısız" },
          { status: 404 }
        );
      }

      await delay(20000); // bekleme süresi

      // Oturum çerezini ayarla
      const response = NextResponse.json({
        success: true,
        message: "Quantify başarılı",
        addedAmount: parseFloat(incrementPerRequest.toFixed(2)), // Yuvarla
        updatedAmount: parseFloat(updatedAmount.toFixed(2)), // Yuvarla
      });
      
      response.cookies.set("session", session, { expires, httpOnly: true });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: "Ölçüm kalmadı" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json(
      { success: false, message: "Sunucu hatası", error: error.message },
      { status: 500 }
    );
  }
}