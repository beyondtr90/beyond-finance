import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import WalletStyle from "./Wallet.module.scss";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import BalanceCard from "../components/balanceCard/BalanceCard";
import CurrentFund from "../components/CurrentFund/CurrentFund";
import TermInvestment from "../components/TermInvestment/TermInvestment";

function Page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const investmentType = user.investment_type;

  return (
    <div>
      <Navbar />
      <main className={WalletStyle.main}>
        <div className={WalletStyle.balanceWrapper}>
          <BalanceCard userId={user.user_id} />
        </div>
        <p>Varlıklarım/ Fonlarım</p>
        <div className={WalletStyle.currentFundWrapper}>
          {investmentType === null ? (
            <p>Fon Bulunmuyor</p>
          ) : Number.isInteger(Number(investmentType)) ? (
            <CurrentFund
              investmentType={investmentType}
              userId={user.user_id}
            ></CurrentFund>
          ) : (
            <>
              {investmentType === "Starter" && (
                <TermInvestment
                  investmentLevel="Starter"
                  userId={user.user_id}
                />
              )}
              {investmentType === "Mid" && (
                <TermInvestment
                  investmentLevel="Mid"
                  userId={user.user_id}
                />
              )}
              {investmentType === "Pro" && (
                <TermInvestment
                  investmentLevel="Pro"
                  userId={user.user_id}
                />
              )}
            </>
          )}
        </div>
        <div className={WalletStyle.walletInfo}>
          <ul>
            <li>
              Eğer yatırım yaptıysanız ve burada görünmüyorsa Profil kısmından
              Oturumu kapatıp tekrar giriş yapınız.
            </li>
          </ul>
        </div>
      </main>
      <TabBar />
    </div>
  );
}

export default Page;
