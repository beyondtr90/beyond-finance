import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import TeamStyle from "./Team.module.scss";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";

async function Page() {
  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
    return null;
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));
  const userInvitationCode = user.invitation_code;

  const host = process.env.NEXT_PUBLIC_BASE_URL;
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
      throw new Error("Failed to fetch team data");
    }

    teamData = await response.json();
  } catch (error) {
    console.error("Error fetching team data:", error);
  }

  const teamSize = teamData.length;

  return (
    <>
      <Navbar />
      <main className={TeamStyle.main}>
        <h1>Takım</h1>
        <h2>Takım Listesi ({teamSize})</h2>
        {teamSize > 0 ? (
          teamData.map((user) => (
            <div key={user._id} className={TeamStyle.userWrapper}>
              <div className={TeamStyle.topWrapper}>
                <p className={TeamStyle.userNumber}>{user.phone}</p>
                <img
                  width="25"
                  height="25"
                  src={`https://img.icons8.com/ios-filled/50/${
                    user.status === "True" ? "46a825" : "575757"
                  }/verified-account.png`}
                  alt="verified-account"
                />
              </div>
              <p>
                Katılım Tarihi:{" "}
                {new Date(user.joined_at).toLocaleDateString("tr-TR")}
              </p>
              <p>Bakiye: {user.balance} USDT</p>
            </div>
          ))
        ) : (
          <p>Kullanıcı Yok</p>
        )}
      </main>
      <TabBar />
    </>
  );
}

export default Page;
