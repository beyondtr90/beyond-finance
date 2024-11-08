"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import BalanceCardStyle from "./BalanceCard.module.scss";

function BalanceCard({ userId }) {
  const [balanceData, setBalanceData] = useState({
    totalBalance: 0,
    withdrawableAmount: 0,
    termAmount: 0,
  });
  const URL = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    async function fetchBalance() {
      try {
        const response = await fetch(`${URL}/api/balance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setBalanceData({
            totalBalance: data.balance,
            withdrawableAmount: data.balance - data.blocked_amount,
            termAmount: data.blocked_amount,
          });
        } else {
          console.error("Balance data could not be fetched");
        }
      } catch (error) {
        console.error("Error fetching balance data:", error);
      }
    }

    if (userId) {
      fetchBalance();
    }
  }, [userId]);

  return (
    <div className={BalanceCardStyle.balanceCard}>
      <div></div>
      <div>
        <p>Toplam Bakiye</p>
        <div className={BalanceCardStyle.balance}>
        ${parseFloat(balanceData.totalBalance).toFixed(2)}
        </div>
      </div>
      <div></div>
      <div>
        <p>Kullanılabilir</p>
        <div className={BalanceCardStyle.balance}>
          ${parseFloat(balanceData.withdrawableAmount).toFixed(2)}
        </div>
      </div>
      <div></div>
      <div>
        <p>İşlemde</p>
        <div className={BalanceCardStyle.balance}>
        ${parseFloat(balanceData.termAmount).toFixed(2)}
        </div>
      </div>
      <div>
        <Link
          className={BalanceCardStyle.withdrawalBtn}
          href="/wallet/withdrawal"
        >
          Çek
        </Link>
      </div>
      <div></div>
      <div>
        <Link className={BalanceCardStyle.depositBtn} href="/wallet/deposit">
          Yatır
        </Link>
      </div>
    </div>
  );
}

export default BalanceCard;
