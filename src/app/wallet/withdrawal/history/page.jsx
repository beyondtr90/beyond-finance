import React from 'react'
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../../components/navbar/Navbar";
import TabBar from "../../../components/tabBar/TabBar";
import historyStyles from "./history.module.scss";
import HistoryCard from '../../../components/historyCard/HistoryCard';

function page() {
    const cookieStore = cookies();
    const session = cookieStore.get("session");
  
    if (!session) {
      redirect("/register");
    }
  
    const { user } = JSON.parse(atob(session.value.split(".")[1]));
    const userId = user.user_id;
  return (
    <div>
        <Navbar></Navbar>
        <main className={historyStyles.main}>
          <HistoryCard userId={userId}></HistoryCard>
        </main>
        <TabBar></TabBar>
    </div>
  )
}

export default page