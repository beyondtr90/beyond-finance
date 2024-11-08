"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    cookies().set("session", "", { expires: new Date(0) });

    return NextResponse.json({ message: 'Logout successful' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Logout failed' }, { status: 500 });
  }
}
