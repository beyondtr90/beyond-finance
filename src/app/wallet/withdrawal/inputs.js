"use client";
import { useState } from "react";
import WithdrawalStyle from "./Withdrawal.module.scss";

const Inputs = ({ userId }) => {
  const [address, setaddress] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangeAmount = (event) => {
    const input = event.target.value;

    if (/^\d*\.?\d*$/.test(input)) {
      setAmount(input);
      setError("");
    } else {
      setError("Geçersiz tutar.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Adres doğrulama
    if (!address || address.length !== 34) {
      setError("Geçersiz çekim adresi");
      return;
    }

    // Miktar kontrolü
    if (parseFloat(amount) <= 10) {
      setError("Minimum çekim miktarına dikkat ediniz");
      return;
    }

    setLoading(true);
    setError(""); // Hata mesajını temizle

    try {
      // API'ye istek gönderme
      const response = await fetch('/api/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address, amount, userId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "İşlem başarısız oldu.");
      }
      setMessage(data.message);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={WithdrawalStyle.addressLabel}>Çekim Adresi</div>
      <input
        className={WithdrawalStyle.withdrawalInput}
        type="text"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
        placeholder="Adres"
        required
      />
      <div className={WithdrawalStyle.amountLabel}>Çekim Tutarı</div>
      <input
        className={WithdrawalStyle.withdrawalInput}
        type="text"
        value={amount}
        onChange={handleChangeAmount}
        placeholder="Tutar"
        required
      />
      {message}
      {error && <div className={WithdrawalStyle.error}>{error}</div>}
      <div className={WithdrawalStyle.btnWrapper}>
        <button type="submit" disabled={loading}>
          {loading ? "Yükleniyor..." : "Çekim Yap"}
        </button>
      </div>
    </form>
  );
};

export default Inputs;