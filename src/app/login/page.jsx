"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginStyle from "./Login.module.scss";
import CountrySelector from "./CountrySelector";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import Modal from "../components/loadingModal/LoadingModal";
import Link from "next/link";

export default function Page() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone || !password || !selectedCountryCode) {
      setError("Phone, country code and password are required");
      return;
    }

    const fullPhoneNumber = `${selectedCountryCode}${phone}`;
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "login",
          phone: fullPhoneNumber,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setLoading(false);
        router.push("/home");
      } else {
        setLoading(false);
        setError(data.error || "Login failed.");
      }
    } catch (err) {
      setLoading(false);
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className={LoginStyle.main}>
        <div className={LoginStyle.logo}>
          <div className={LoginStyle.logoWrapper}>
            <img
              src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727567662/beyond-logo_ouujns.png"
              alt="logo"
            />
          </div>
        </div>
        <div className={LoginStyle.regTitle}>Giriş Yap</div>
        <section>
          <form onSubmit={handleSubmit}>
            <div className={LoginStyle.numberInputWrapper}>
              <CountrySelector setSelectedOption={setSelectedCountryCode} />
              <input
                className={LoginStyle.phoneInput}
                type="text"
                pattern="[a-zA-Z0-9]+"
                placeholder="Telefon numarası"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className={LoginStyle.otherInputsWrapper}>
              <input
                type="password"
                pattern="[a-zA-Z0-9]+"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <div className="error">{error}</div>}
              <div className={LoginStyle.btnWrapper}>
                <button type="submit">Giriş Yap</button>
              </div>
            </div>
          </form>
          <div className={LoginStyle.registerBtn}>
            <Link href={"/register"}>Kayıt Ol</Link>
          </div>
        </section>
      </main>
      {loading && <Modal />}
      <TabBar />
    </div>
  );
}
