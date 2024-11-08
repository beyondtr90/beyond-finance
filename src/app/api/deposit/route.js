import { TronWeb } from "tronweb";
import { connectToDatabase } from "../../lib/mongodb";
import { encrypt, decrypt } from "../auth/route";
import { cookies } from "next/headers";
import { NextResponse } from 'next/server'; // Import NextResponse

export async function POST(req) {
  const { userId, balance, hash, amount } = await req.json();
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session"); // Tanımlama

  const txidLength = hash.length;
  const amountAll = Math.floor(amount * 1000000);
  const receiver = process.env.RECEIVER;
  const network = "mainnet";

  let url;
  switch (network) {
    case "shasta":
      url = "https://api.shasta.trongrid.io";
      break;
    case "nile":
      url = "https://nile.trongrid.io";
      break;
    case "mainnet":
      url = "https://api.trongrid.io";
      break;
    default:
      return new Response(JSON.stringify({ msg: "Invalid network" }), {
        status: 400,
      });
  }

  if (Math.round(amount) !== amount) {
    return new Response(JSON.stringify({ msg: "Only Number Integer" }), {
      status: 403,
    });
  }

  if (txidLength < 64) {
    return new Response(JSON.stringify({ msg: "The Hash Is Invalid" }), {
      status: 404,
    });
  }

  const { db } = await connectToDatabase();
  const existingDeposit = await db.collection("deposits").findOne({ hash });

  if (existingDeposit) {
    return new Response(JSON.stringify({ msg: "The Hash Is In System" }), {
      status: 401,
    });
  }

  try {
    console.log("Checking Deposit...");
    const tronWeb = new TronWeb({ fullHost: url });
    const verifyTx = await tronWeb.getEventByTransactionID(hash);

    if (
      !verifyTx ||
      !verifyTx.data ||
      verifyTx.data.length === 0 ||
      !verifyTx.data[0].result
    ) {
      return new Response(JSON.stringify({ msg: "Transaction Not Found" }), {
        status: 404,
      });
    }

    const result = verifyTx.data[0].result;
    const addressBs58 = tronWeb.address.fromHex(result.to);

    if (receiver !== addressBs58) {
      return new Response(JSON.stringify({ msg: "Transfer Be Invalid" }), {
        status: 403,
      });
    }

    if (amountAll !== parseInt(result.value, 10)) {
      return new Response(JSON.stringify({ msg: "Amount Be Invalid" }), {
        status: 401,
      });
    }

    const response = await fetch(
      "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul"
    );
    const timeData = await response.json();
    const createdAt = timeData.dateTime;

    await db.collection("deposits").insertOne({
      user_id: userId,
      hash,
      amount,
      created_at: createdAt,
    });

    const newBalance = parseFloat(balance) + parseFloat(amount);
    let userStatus = amount >= 100;

    await db
      .collection("users")
      .updateOne(
        { user_id: userId },
        { $set: { balance: newBalance, status: userStatus } }
      );

    const session = await decrypt(sessionCookie.value);
    session.user.status = userStatus;

    const expires = new Date(Date.now() + 60 * 60 * 3 * 1000);
    const newSession = await encrypt({ user: session.user, expires });

    const responseJson = NextResponse.json({
      success: true,
      message: "Purchase success, session updated",
    });
    responseJson.cookies.set("session", newSession, { expires, httpOnly: true });

    console.log("Balance updated successfully!");
    return responseJson; // Dönüş
  } catch (error) {
    console.log("Error occurred:", error);
    return new Response(JSON.stringify({ msg: "Operation Failed" }), {
      status: 400,
    });
  }
}
