import { connectToDatabase } from "../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { db } = await connectToDatabase();

    // Tüm yatırım işlemlerini çek
    const investments = await db
      .collection("fund_investments")
      .find()
      .toArray();

    if (investments.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No investments found",
        },
        { status: 404 }
      );
    }

    const updatePromises = investments.map(async (investment) => {
      let dailyReturn = 0;

      switch (investment.fund_id) {
        case 1:
          dailyReturn = 6;
          break;
        case 2:
          dailyReturn = 12;
          break;
        case 3:
          dailyReturn = 42;
          break;
        case 4:
          dailyReturn = 100;
          break;
        case 5:
          dailyReturn = 220;
          break;
        case 6:
          dailyReturn = 400;
          break;
        case 7:
          dailyReturn = 750;
          break;
        case 8:
          dailyReturn = 1275;
          break;
        case 9:
          dailyReturn = 2500;
          break;
        case 10:
          dailyReturn = 8000;
          break;
        default:
          dailyReturn = 0;
      }

      // Kullanıcı verilerini getir
      const user = await db
        .collection("users")
        .findOne({ user_id: investment.user_id });
      if (!user) {
        console.error(`User with ID ${investment.user_id} not found.`);
        return; // Kullanıcı bulunamazsa, işlemi atlayın
      }

      const newBalance = user.balance + dailyReturn;
      const updatedDailyEarn = user.daily_earning + dailyReturn;
      const updatedTotalEarn = user.total_earning + dailyReturn;

      // Kullanıcının bakiyesini güncelle
      await db
        .collection("users")
        .updateOne(
          { user_id: investment.user_id },
          {
            $set: {
              balance: newBalance,
              daily_earning: updatedDailyEarn,
              total_earning: updatedTotalEarn,
            },
          }
        );
    });

    // Tüm güncellemeleri tamamla
    await Promise.allSettled(updatePromises);

    return NextResponse.json(
      {
        success: true,
        message: "balances successfully updated",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating investments",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
