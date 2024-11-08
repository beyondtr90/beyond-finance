import React from "react";
import NotificationsStyle from "./Notifications.module.scss";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";

function page() {
  return (
    <div>
      <Navbar></Navbar>
      <main className={NotificationsStyle.main}>
        <div className={NotificationsStyle.card}>
          <p className={NotificationsStyle.title}>Hoşgeldiniz!</p>
          <p>
            BEYOND INC ailesine hoş geldiniz! Beyond ile hemen özgürce yatırım
            yapmaya başlayabilirsiniz. Eğer sorunuz var ise müşteri hizmetleri
            ile iletişime geçebilirsiniz.
          </p>
        </div>
      </main>
      <TabBar></TabBar>
    </div>
  );
}

export default page;
