import React from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import WithdrawalStyle from "./Withdrawal.module.scss";
import Inputs from "./inputs";

function WithdrawalPage() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const userId = user.user_id;

  return (
    <div>
      <Navbar />
      <main className={WithdrawalStyle.main}>
        <div className={WithdrawalStyle.currencyLabel}>Para Birimi</div>
        <div className={WithdrawalStyle.currencyImg}>
          <img
            src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727719911/825_snkrei.png"
            alt="currency"
          />
        </div>
        <div className={WithdrawalStyle.tronLabel}>Çekim Ağı</div>
        <div className={WithdrawalStyle.tron}>
          <div>TRC-20</div>
        </div>
        <Inputs userId={userId}></Inputs>
        <div className={WithdrawalStyle.withBtnWr}>
          <Link href={"/wallet/withdrawal/history"}>
            Çekimlerim {""}
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/ios-filled/50/forward--v1.png"
              alt="forward--v1"
            />
          </Link>
        </div>
        <div className={WithdrawalStyle.infos}>
          <ul>
            <li>
              Eğer çekim veya başka konuda yardıma ihtiyacınız varsa "Profil
              {">"}Yardım ve Destek" kısmından yardım alabilirsiniz.
            </li>
            <li>Minimum çekim miktarı 10 USDT</li>
            <li>Maximum çekim tutarı 20.000 USDT</li>
            <li>
              Çekiminizin cüzdanınıza yansıma süresi 1-24 saat arasındadır
            </li>
          </ul>
        </div>
      </main>
      <TabBar />
    </div>
  );
}

export default WithdrawalPage;
