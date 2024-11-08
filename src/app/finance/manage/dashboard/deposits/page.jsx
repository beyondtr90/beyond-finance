import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../../../components/managerComponents/Navbar/Navbar";
import Deposits from "../../../../components/managerComponents/Deposits/Deposits";
import styles from "./styles.module.scss";

function page() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    redirect("/home");
  }

  return (
    <div className={styles.page}>
      <Navbar></Navbar>
      <main className={styles.main}>
       <Deposits></Deposits>
      </main>
    </div>
  );
}

export default page;
