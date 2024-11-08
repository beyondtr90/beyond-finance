import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import DepositStyle from "./Deposit.module.scss";
import QRCode from "./QRCode";
import Copier from "./Copier";
import DepositModal from "./DepositModal";

function DepositPage() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }
  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  return (
    <div>
      <Navbar></Navbar>
      <main className={DepositStyle.main}>
        <div className={DepositStyle.currencyLabel}>Para Birimi</div>
        <div className={DepositStyle.currencyImg}>
          <img
            src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727719911/825_snkrei.png"
            alt="currency"
          />
        </div>
        <div className={DepositStyle.tronLabel}>Yatırım Ağı</div>
        <div className={DepositStyle.tron}>
          <div>TRC-20</div>
        </div>
        <div className={DepositStyle.addressLabel}>Yatırım Adresi</div>
        <Copier depositAdress={process.env.RECEIVER}></Copier>
        <div className={DepositStyle.qrWrapper}>
          <QRCode value={process.env.RECEIVER} />
        </div>
        <div className={DepositStyle.depositForm}>
          <DepositModal
            balance={user.balance}
            userId={user.user_id}
          ></DepositModal>
        </div>
        <div className={DepositStyle.infos}>
          <ul>
            <li>Yatırımınızı USDT olarak Tron(TRC-20) ağından yapınız.</li>
            <li>
              Yatırım yaptığınız uygulamadan "Hash" veya "Transiction ID" yazan
              yeri kopyalayıp ilgili yere yapıştırınız ardından "Yatırım Yaptım"
              butonuna tıklayınız. Yatırımınız tarafımıza geçene kadar
              bekleyiniz ve sayfayı terketmeyiniz.
            </li>
            <li>
              Eğer daha önce kullandığınız bir hash adresini kullanmaya
              çalışırsanız, hash adresiniz hatalıysa veya tutar hatalıysa
              başarısız hatası alırsınız.
            </li>
            <li>
              Eğer Yatırım veya başka konuda yardıma ihtiyacınız varsa "Profil
              {">"}Yardım ve Destek" kısmından yardım alabilirsiniz.
            </li>
            <li>
              Yatırımınızın hesabınıza yansıma süresi 5-15 minutes arasındadır
            </li>
          </ul>
        </div>
      </main>
      <TabBar></TabBar>
    </div>
  );
}

export default DepositPage;
