// api/auth/login.js
"use server";
import { connectToDatabase } from "../../lib/mongodb";
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { NextResponse } from "next/server";

const secretKey = process.env.JWT_AUTH_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .sign(key);
}

export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login({ phone, password }) {
  const { db } = await connectToDatabase();
  
  const user = await db.collection("users").findOne({ phone });
  
  // Kullanıcı yoksa hata fırlat
  if (!user) {
    throw new Error("Geçersiz telefon numarası veya şifre.");
  }

  // Şifre doğrulama
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error("Geçersiz telefon numarası veya şifre.");
  }

  const expires = new Date(Date.now() + 60 * 60 * 3 * 1000);
  const session = await encrypt({ user, expires });

  const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
  response.cookies.set("session", session, { expires, httpOnly: true });
  
  return response;
}

export async function logout() {
  const response = NextResponse.json({ message: "Logout successful" }, { status: 200 });
  response.cookies.set("session", "", { expires: new Date(0) });
  return response;
}

export async function POST(req) {
  try {
    const { action, phone, password } = await req.json();

    if (action === 'login') {
      return await login({ phone, password });
    } else if (action === 'logout') {
      return await logout();
    } else {
      return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error: error.message || 'İşlem başarısız' }, { status: 401 });
  }
}
