import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ProfileStyle from "./profile.module.scss";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import Link from "next/link";
import QRCode from "./QRCode";
import Copier from "./Copier";
import LogoutButton from "./LogoutButton";

async function ProfilePage() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const userInvitationCode = user.invitation_code;
  
  const host = process.env.NEXT_PUBLIC_BASE_URL;
  console.log(host);
  let teamData = [];
  try {
    const response = await fetch(`${host}/api/getTeam`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ invitationCode: userInvitationCode }),
    });
  
    if (!response.ok) {
      console.error("API Error:", response.status, response.statusText);
      throw new Error("Failed to fetch team data");
    }
  
    teamData = await response.json();
    // console.log("Team data received:", teamData);
  } catch (error) {
    console.error("Error fetching team data:", error.message);
  }
  
  const teamSize = Array.isArray(teamData) ? teamData.length : 0;
  

  return (
    <div>
      <Navbar />
      <main className={ProfileStyle.main}>
        <div className={ProfileStyle.userNumber}>
          <span>
            {user.phone}
            <img
              width="25"
              height="25"
              src={`https://img.icons8.com/ios-filled/50/${
                user.status === true ? "46a825" : "575757"
              }/verified-account.png`}
              alt="verified-account"
            />
          </span>
          {user.status === true
            ? "Hesabınız Doğrulandı"
            : "Hesabınız Doğrulanmadı"}
        </div>
        <div className={ProfileStyle.referenceCode}>
          Referans Kodu: {user.invitation_code}
        </div>
        <div>Varlıklar</div>
        <div className={ProfileStyle.userProfileInfoWrapper}>
          <div>
            <div>Toplam Kazanç</div>
            <div> ${parseFloat(Number(user.total_earning).toFixed(2))}</div>
          </div>
          <div>
            <div>Günlük Kazanç</div>
            <div>${parseFloat(Number(user.daily_earning).toFixed(2))}</div>
          </div>
          <div>
            <div>Takım Boyutu</div>
            <div>{teamSize}</div>
          </div>
          <div>
            <div>Toplam Çekim</div>
            <div>${parseFloat(Number(user.total_withdrawal_amount).toFixed(2))}</div>
          </div>
        </div>
        <div className={ProfileStyle.optionsWrapper}>
          <ul>
            <li>
              <Link href="/profile/team">
                Takımı görüntüle
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/forward--v1.png"
                  alt="forward--v1"
                />
              </Link>
            </li>
            <li>
              <Link href="/profile/mail">
                E-posta
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/forward--v1.png"
                  alt="forward--v1"
                />
              </Link>
            </li>
            <li>
              <Link href="/profile/password">
                Şifre Değiştir
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/forward--v1.png"
                  alt="forward--v1"
                />
              </Link>
            </li>
            <li>
              <Link href="/profile/support">
                Yardım ve Destek
                <img
                  width="50"
                  height="50"
                  src="https://img.icons8.com/ios-filled/50/forward--v1.png"
                  alt="forward--v1"
                />
              </Link>
            </li>
            <li>
              <LogoutButton></LogoutButton>
            </li>
          </ul>
        </div>
        <div className={ProfileStyle.inviteWrapper}>
          <div style={{ marginTop: "20px" }}>
            <QRCode invitationCode={user.invitation_code}></QRCode>
            <div>Referans Kodu: {user.invitation_code}</div>
            <Copier invitationCode={user.invitation_code}></Copier>
          </div>
        </div>
        <div className={ProfileStyle.downloadappLabel}>Uygulamayı İndir</div>
        <div className={ProfileStyle.appLinksWrapper}>
          <div>
            <img
              src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727719911/ios_jz4ta7.png"
              alt="ios"
            />
          </div>
          <div>
            <img
              src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727719911/android_pjeexf.png"
              alt="apk"
            />
          </div>
        </div>
      </main>
      <TabBar />
    </div>
  );
}

export default ProfilePage;
