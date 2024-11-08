// src/app/not-found.js
import React from "react";
import Link from "next/link";
import Navbar from "./components/navbar/Navbar";
import TabBar from "./components/tabBar/TabBar";
import styles from "./notFound.module.scss";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.notFoundWrapper}>
          <h1>404</h1>
          <p>Aradığınız Sayfa Bulunamadı!</p>
          <Link href="/home">Anasayfa'ya Dön</Link>
        </div>
      </main>
      <TabBar />
    </>
  );
}
