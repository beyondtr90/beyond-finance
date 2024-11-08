import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import MailForm from "./MailForm";
import MailStyle from "./Mail.module.scss";

function page() {

  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const userId = user.user_id;
  const userMail = user.email;

  return (
    <div>
      <Navbar></Navbar>
      <main className={MailStyle.main}>
        <div className={MailStyle.mainLabel}>E-Posta</div>
        <MailForm userId={userId}></MailForm>
        <div className={MailStyle.currentMail}>
          <div>Aktif E-posta Adresiniz:</div>
          <p>{userMail ? userMail : "E-posta bulunmuyor"}</p>
        </div>
        <div className={MailStyle.infoWrapper}>
            <ul>
                <li>Hesap güvenliğiniz için e-posta ekleyin.</li>
                <li>Şifrenizi unutmanız halinde e-postanız ile hesabınızı kurtarabilirsiniz.</li>
            </ul>
        </div>
      </main>
      <TabBar></TabBar>
    </div>
  );
}

export default page;
