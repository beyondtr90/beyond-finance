import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../../components/navbar/Navbar";
import TabBar from "../../../components/tabBar/TabBar";
import ProStyle from "./Pro.module.scss";
import Card from "./Card";

function ProPage() {

    const cookieStore = cookies();
    const session = cookieStore.get("session");
  
    if (!session) {
      redirect("/register");
    }
    const { user } = JSON.parse(atob(session.value.split(".")[1]));
    const invitationCode = user.invitation_code;
    
  return (
    <>
      <Navbar></Navbar>
      <main className={ProStyle.main}>
        <Card userId={user.user_id} invitationCode={invitationCode}></Card>
      </main>
      <TabBar></TabBar>
    </>
  );
}

export default ProPage;
