// api/auth/register.js
"use server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "../../lib/mongodb";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
    const { phone, password, referenceCode, generatedInvitationCode } = await req.json();
    const { db } = await connectToDatabase();

    const user = await db.collection('users').findOne({ phone });
    if (user) {
      return NextResponse.json(
        { error: "Bu telefon numarası zaten kayıtlı" },
        { status: 409 }
      );
    }
    const invitationDetect = await db.collection('users').findOne({ invitation_code: referenceCode });
    if (!invitationDetect) {
      return NextResponse.json(
        { error: "Referans kodu geçersiz" },
        { status: 409 }
      );
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await db.collection('users').insertOne({
      user_id: uuidv4(),
      phone,
      email: null,
      password: hashedPassword,
      status: false,
      deposit: parseFloat(0),
      blocked_amount: parseFloat(0),
      balance: parseFloat(0),
      daily_earning: parseFloat(0),
      total_earning: parseFloat(0),
      total_withdrawal_amount: parseFloat(0),
      investment_type: null,
      reference_owner: referenceCode,
      invitation_code: generatedInvitationCode,
      joined_at: new Date().toISOString(),
    });

    const newUser = await db.collection('users').findOne({ phone });

    const expires = new Date(Date.now() + 60 * 60 * 3 * 1000);
    const session = await encrypt({ user: newUser, expires });

    const response = NextResponse.json(
      { message: "Kullanıcı başarıyla kaydedildi ve giriş yapıldı" },
      { status: 201 }
    );
    response.cookies.set("session", session, { expires, httpOnly: true });

    return response;
  } catch (error) {
    console.error("API sürecinde hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
