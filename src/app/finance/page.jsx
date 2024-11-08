import React from "react";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import styles from "./styles.module.scss";

function page() {
  return (
    <>
      <Navbar></Navbar>
      <main className={styles.main}>
        <div className={styles.notFoundWrapper}>
          <h1>404</h1>
          <Link className={styles.routeLink} href={"/finance/manage"}>Aradığınız Sayfa Bulunamadı!</Link>
          <Link href={"/home"}>Anasayfa'ya Dön</Link>
        </div>
      </main>
      <TabBar></TabBar>
    </>
  );
}

export default page;
