import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { userId, newPassword } = await request.json();
    const { db } = await connectToDatabase();

    // Kullanıcıyı kontrol et
    const user = await db.collection("users").findOne({ user_id: userId });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Yeni şifreyi hashleyin
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Kullanıcının şifresini güncelleyin
    await db.collection("users").updateOne(
      { user_id: userId },
      { $set: { password: hashedPassword } }
    );

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
