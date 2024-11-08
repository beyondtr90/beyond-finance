import { TronWeb } from "tronweb";
import { connectToDatabase } from "../../../lib/mongodb";

const getTronGridUrl = (network) => {
  switch (network) {
    case "shasta":
      return "https://api.shasta.trongrid.io";
    case "nile":
      return "https://nile.trongrid.io";
    case "mainnet":
    default:
      return "https://api.trongrid.io";
  }
};

export async function POST(req) {
  const { user_id, phone, amount, address } = await req.json();
  const fromAddress = process.env.RECEIVER;
  const toAddress = address;

  if (!fromAddress || !toAddress || !amount) {
    return new Response(
      JSON.stringify({ msg: "Cüzdan adresi ve miktar gerekli." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const network = "mainnet";
  const url = getTronGridUrl(network);

  const tronWeb = new TronWeb({
    fullHost: url,
    privateKey: process.env.TRON_PRIVATE_KEY,
  });

  try {
    const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
    const usdtContract = await tronWeb.contract().at(USDT_CONTRACT);

    const usdtAmount = tronWeb.toHex((amount * 1e6).toString());

    const usdtBalance = await usdtContract.methods
      .balanceOf(fromAddress)
      .call();
    const usdtAmountDecimal = tronWeb.toDecimal(usdtBalance);

    if (usdtAmountDecimal < amount * 1e6) {
      return new Response(JSON.stringify({ msg: "Yetersiz bakiye." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const transaction = await usdtContract.methods
      .transfer(toAddress, usdtAmount)
      .send({
        from: fromAddress,
      });

    const { db } = await connectToDatabase();
    const timeResponse = await fetch(
      "https://timeapi.io/api/time/current/zone?timeZone=Europe%2FIstanbul"
    );
    const timeData = await timeResponse.json();

    const currentDate = new Date(timeData.dateTime);
    const formattedDate = currentDate.toISOString();

    await db.collection("withdrawals").insertOne({
      user_id,
      phone,
      amount,
      status: "Gönderildi",
      address,
      transactionId: transaction,
      created_at: formattedDate,
    });
    // DELETE REQUEST
    const deleteResult = await db.collection("requests").deleteOne({ user_id });

    if (!deleteResult.acknowledged) {
      console.error("Failed to delete request:", deleteResult);
      throw new Error("Failed to delete request");
    }

    return new Response(
      JSON.stringify({ msg: "Transfer başarılı", transaction }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Hata:", error.message);
    return new Response(
      JSON.stringify({ msg: "Bir hata oluştu.", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
