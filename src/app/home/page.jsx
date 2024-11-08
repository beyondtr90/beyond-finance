import { cookies } from "next/headers";
import React from "react";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import HomeStyle from "./home.module.scss";

export default async function Page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  let phone = null;

  if (session) {
    const { user } = JSON.parse(atob(session.value.split(".")[1]));
    phone = user.phone;
  }

  return (
    <div>
      <Navbar />
      <main className={HomeStyle.main}>
        <div className={HomeStyle.welcomer}>
          <hr className={HomeStyle.firstLine} />
          <div>
            <span>Hoşgeldiniz</span>
            <span className={HomeStyle.userNumber}>
              {phone ? phone : "Giriş yapınız"}
            </span>
          </div>
          <hr className={HomeStyle.secondLine} />
        </div>
        <div className={HomeStyle.banner}>
          <img
            src="https://res.cloudinary.com/dl7u49phz/image/upload/v1728753476/1_jtw7xj.png"
            alt="banner"
          />
        </div>
        <table className={HomeStyle.table}>
          <thead>
            <tr>
              <th>Fon</th>
              <th>Paket Fiyatı</th>
              <th>Haftalık Yükseliş</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>AMGANI</td>
              <td>15.000,00</td>
              <td className={HomeStyle.amount}>116,6%</td>
            </tr>
            <tr>
              <td>INVSCO</td>
              <td>7.650,00</td>
              <td className={HomeStyle.amount}>116,6%</td>
            </tr>
            <tr>
              <td>DIAMOND</td>
              <td>40.000,00</td>
              <td className={HomeStyle.amount}>140%</td>
            </tr>
            <tr>
              <td>SFNEX</td>
              <td>4.500,00</td>
              <td className={HomeStyle.amount}>116,6%</td>
            </tr>
          </tbody>
        </table>
        <div className={HomeStyle.userProcess}>
          <Link href="/profile">
            <p>Arkadaşlarını davet et</p>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/parakeet-line/48/add-user-male.png"
              alt="add-user-male"
            />
          </Link>
          <Link href="/home/taskCenter">
            <p>Ana görev merkezi</p>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/carbon-copy/100/task.png"
              alt="task"
            />
          </Link>
          <Link href="#">
            <p>Müşteri hizmetleri</p>
            <img
              width="40"
              height="40"
              src="https://img.icons8.com/ios/50/customer-support.png"
              alt="customer-support"
            />
          </Link>
        </div>
        <div className={HomeStyle.faq}>
          <span>Sık Sorulan Sorular</span>
          <ul>
            <li><Link href={"/home/about-investment"}>Neye yatırım yapıyorum ?</Link></li>
            <li><Link href={"/home/the-rules"}>Uygulamanın kullanım şartları ve kurallar nelerdir ?</Link></li>
          </ul>
        </div>
      </main>
      <TabBar />
    </div>
  );
}
