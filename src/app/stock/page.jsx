import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import StockStyle from "./Stock.module.scss";
import Link from "next/link";

function page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));

  return (
    <div>
      <Navbar></Navbar>
      <main className={StockStyle.main}>
        <Link
          href="/stock/termInvestment"
          className={StockStyle.investmentWrapper}
        >
          <h3>Vadeli Yatırım</h3>
          <p>
            Eğer yatırımınızı haftalık kazanç modeliyle yatırmak istiyorsanız
            sizin için ideal.
          </p>
        </Link>
        <Link
          href="/stock/fundInvestment"
          className={StockStyle.investmentWrapper}
        >
          <h3>Fon Yatırımı</h3>
          <p>
            Yatırımcı çevreniz varsa satın aldığınız fon ile günlük çekim
            yapabilirsiniz. Her 3 günde 1 kişiyi davet etmeniz gerekmektedir.
          </p>
        </Link>
      </main>
      <TabBar></TabBar>
    </div>
  );
}

export default page;
