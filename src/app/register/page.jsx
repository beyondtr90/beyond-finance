"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/navbar/Navbar";
import TabBar from "../components/tabBar/TabBar";
import RegisterStyle from "./Register.module.scss";
import CountrySelector from "./CountrySelector";
import Modal from "../components/loadingModal/LoadingModal";

function Page() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [referenceCode, setReferenceCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if (code) {
      setReferenceCode(code);
    }
  }, []);

  const generateInvitationCode = (length = 8) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let invitationCode = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      invitationCode += characters[randomIndex];
    }
    return invitationCode;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phone) return setError("Phone is required");
    if (!password) return setError("Password is required");
    if (!selectedCountryCode) return setError("Country code is required");
    if (password !== passwordConfirm) return setError("Passwords do not match");

    const fullPhoneNumber = `${selectedCountryCode}${phone}`;
    const newInvitationCode = generateInvitationCode(8);

    setLoading(true);

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: fullPhoneNumber,
          password,
          referenceCode,
          generatedInvitationCode: newInvitationCode,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setLoading(false);
        router.push("/home");
      } else {
        setLoading(false);
        setError(data.error || "Registration failed");
      }
    } catch {
      setLoading(false);
      setError("An error has occurred. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <main className={RegisterStyle.main}>
        <div className={RegisterStyle.logo}>
          <div className={RegisterStyle.logoWrapper}>
            <img
              src="https://res.cloudinary.com/dl7u49phz/image/upload/v1727567662/beyond-logo_ouujns.png"
              alt="logo"
            />
          </div>
        </div>
        <div className={RegisterStyle.regTitle}>Üye Ol</div>
        <section>
          <span>Hesap Bilgileri</span>
          <form onSubmit={handleSubmit}>
            <div className={RegisterStyle.phoneWrapper}>
              <CountrySelector setSelectedOption={setSelectedCountryCode} />
              <input
                className={RegisterStyle.phoneInput}
                type="text"
                pattern="^\+?[0-9]{8,12}$"
                placeholder="Telefon numarası"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div className={RegisterStyle.otherInputsWrapper}>
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Şifre (Tekrar)"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Referans Kodu"
                value={referenceCode}
                onChange={(e) => setReferenceCode(e.target.value)}
                required
              />
              <Link href="/register/agreement">Aydınlatma metni</Link>
              {error && <div className="error">{error}</div>}
              <div className={RegisterStyle.btnWrapper}>
                <button type="submit">Üye Ol</button>
              </div>
              <div className={RegisterStyle.loginbtn}>
                <Link href="/login">Giriş Yap</Link>
              </div>
            </div>
          </form>
        </section>
      </main>
      {loading && <Modal/>}
      <TabBar />
    </div>
  );
}

export default Page;
