import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import TabBar from "../../components/tabBar/TabBar";
import TermStyle from "./Term.module.scss";
import Link from "next/link";

function page() {

  const cookieStore = cookies();
  const session = cookieStore.get("session");

  if (!session) {
    redirect("/register");
  }

  const { user } = JSON.parse(atob(session.value.split(".")[1]));

  return (
    <>
      <Navbar></Navbar>
      <main className={TermStyle.main}>
        <div className={TermStyle.investmentWrapper}>
          <h4 className={TermStyle.starter}>Beyond Başlangıç</h4>
          <div className={TermStyle.subWrapper}>
            <div className={TermStyle.subWrapperTitle}>Günlük Kazanç</div>
            <div className={TermStyle.subWrapperTitle}>
              Gereken Davet Sayısı
            </div>
            <div>3%</div>
            <div>0</div>
            <div className={TermStyle.subWrapperTitle}>Günlük Ölçüm Sayısı</div>
            <div className={TermStyle.subWrapperTitle}>Süre</div>
            <div>3</div>
            <div>7 gün</div>
          </div>
          <div className={TermStyle.btnWrapper}>
            <Link href="/stock/termInvestment/Starter" className={TermStyle.starterBtn}>Seç</Link>
          </div>
        </div>
        <div className={TermStyle.investmentWrapper}>
          <h4 className={TermStyle.mid}>Beyond Mid</h4>
          <div className={TermStyle.subWrapper}>
            <div className={TermStyle.subWrapperTitle}>Günlük Kazanç</div>
            <div className={TermStyle.subWrapperTitle}>
              Gereken Davet Sayısı
            </div>
            <div>6%</div>
            <div>4 (minimum: $100)</div>
            <div className={TermStyle.subWrapperTitle}>Günlük Ölçüm Sayısı</div>
            <div className={TermStyle.subWrapperTitle}>Süre</div>
            <div>4</div>
            <div>7 gün</div>
          </div>
          <div className={TermStyle.btnWrapper}>
            <Link href="/stock/termInvestment/Mid" className={TermStyle.midBtn}>Seç</Link>
          </div>
        </div>
        <div className={TermStyle.investmentWrapper}>
          <h4 className={TermStyle.advanced}>Beyond Pro</h4>
          <div className={TermStyle.subWrapper}>
            <div className={TermStyle.subWrapperTitle}>Günlük Kazanç</div>
            <div className={TermStyle.subWrapperTitle}>
              Gereken Davet Sayısı
            </div>
            <div>10%</div>
            <div>8 (minimum: $100)</div>
            <div className={TermStyle.subWrapperTitle}>Günlük Ölçüm Sayısı</div>
            <div className={TermStyle.subWrapperTitle}>Süre</div>
            <div>5</div>
            <div>7 gün</div>
          </div>
          <div className={TermStyle.btnWrapper}>
            <Link href="/stock/termInvestment/Pro" className={TermStyle.proBtn}>Seç</Link>
          </div>
        </div>
      </main>
      <TabBar></TabBar>
    </>
  );
}

export default page;
