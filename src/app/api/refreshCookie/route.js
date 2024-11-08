"use server"
import { decrypt, encrypt } from "../auth/route"; // Gerekli fonksiyonları import edin
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Mevcut çerezi al
    const cookieStore = cookies();
    const session = cookieStore.get("session");

    if (!session) {
      throw new Error("Oturum geçersiz.");
    }

    // Oturumu doğrula
    const payload = await decrypt(session.value); // session.value'yu kullanarak çerezin değerini alın

    // Yeni oturum oluştur
    const expires = new Date(Date.now() + 60 * 60 * 3 * 1000); // 3 saatlik geçerlilik süresi
    const newSession = await encrypt(payload);

    // Yeni çerezi ayarla
    const response = NextResponse.json({ message: "Oturum yenilendi." }, { status: 200 });
    response.cookies.set("session", newSession, { expires, httpOnly: true });

    return response;
  } catch (error) {
    console.error("Oturum yenileme hatası:", error); // Hata ayıklama için konsola yazdır
    return NextResponse.json({ error: error.message || "Oturum yenileme başarısız." }, { status: 401 });
  }
}
