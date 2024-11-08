import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import FundsStyle from "./Funds.module.scss";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import FundFetcher from "./fundFetcher";

function page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }
  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const currentFund = user.investment_type

  return (
    <div>
      <Navbar></Navbar>
      <main className={FundsStyle.main}>
      <FundFetcher userId={user.user_id} currentFund={currentFund}></FundFetcher>
      </main>
      <TabBar></TabBar>
    </div>
  );
}

export default page;
