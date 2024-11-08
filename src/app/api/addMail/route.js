"use server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../lib/mongodb";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function POST(req) {
  try {
    const { userId, email } = await req.json();
    const { db } = await connectToDatabase(); // Veritabanı bağlantısını al

    // Kullanıcının e-posta adresini güncelle
    const result = await db.collection('users').updateOne(
      { user_id: userId },
      { $set: { email } } // E-posta alanını güncelle
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "user not found" },
        { status: 404 }
      );
    }

    // Güncellenmiş kullanıcı bilgilerini al
    const updatedUser = await db.collection('users').findOne({ user_id: userId });

    // JWT oluştur
    const expires = new Date(Date.now() + 60 * 60 * 3 * 1000); // 3 saat geçerli
    const session = await encrypt({ user: updatedUser, expires });

    // Yanıt oluştur ve oturumu yenile
    const response = NextResponse.json(
      { success: true, message: "E-posta başarıyla güncellendi" },
      { status: 200 }
    );
    response.cookies.set("session", session, { expires, httpOnly: true });

    return response;
  } catch (error) {
    console.error("API sürecinde hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
