"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link";
import NavbarStyles from "./Navbar.module.scss";

function Navbar() {
  const [usdtBalance, setUsdtBalance] = useState("Loading...");
  const fromAddress = "TWSrB9RC9sk4uRWr6WbaENCpwVWnTgFSfD";
  const URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const getUSDTBalance = async () => {
      try {
        const response = await fetch(`${URL}/api/managerApis/getBalance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address: fromAddress }),
        });

        const data = await response.json();
        
        if (response.ok) {
          setUsdtBalance(data.usdtBalance);
        } else {
          setUsdtBalance("Error fetching balance");
          console.error(data.msg);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
        setUsdtBalance("Error");
      }
    };

    getUSDTBalance();
  }, [fromAddress]);

  return (
    <nav className={NavbarStyles.navbar}>
      <ul>
        <li>
          <h1>Admin</h1>
        </li>
        <li>
          <Link href={"/finance/manage/dashboard"}>Dashboard</Link>
        </li>
        <li>
          <Link href={"/finance/manage/dashboard/requests"}>Requests</Link>
        </li>
        <li>
          <Link href={"/finance/manage/dashboard/deposits"}>Deposits</Link>
        </li>
        <li>
          <Link href={"/finance/manage/dashboard/withdrawals"}>
            Withdrawals
          </Link>
        </li>
      </ul>
      <div className={NavbarStyles.balance}>{usdtBalance} USDT</div>
    </nav>
  );
}

export default Navbar;
