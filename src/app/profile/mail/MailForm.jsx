"use client"
import React, { useState } from "react";
import MailStyle from "./Mail.module.scss";

function MailForm({ userId }) {
  const [email, setEmail] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini önler

    // Post işlemi
    try {
      const response = await fetch("/api/addMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, email }), // mail adresini JSON formatında gönderiyoruz
      });

      const data = await response.json();
      if (data.success) {
        setModalMessage("Mail başarıyla güncellendi");
      } else {
        setModalMessage("Bir hata oluştu: " + data.message);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
      setModalMessage("Bir hata oluştu.");
    }
    setModalVisible(true); // Modal'ı göster
  };

  const handleCloseModal = () => {
    setModalVisible(false); // Modal'ı kapat
    window.location.reload();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={MailStyle.inputWrapper}>
          <input
            className={MailStyle.mailInput}
            type="email"
            placeholder="E-Posta"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Mail inputunu state'e bağladık
          />
        </div>
        <div className={MailStyle.btnWrapper}>
          <button className={MailStyle.sbmitBtn} type="submit">
            Gönder
          </button>
        </div>
      </form>

      {modalVisible && (
        <div className={MailStyle.modalOverlay}>
          <div className={MailStyle.modalContent}>
            <p className={MailStyle.modalMessage}>{modalMessage}</p>
            <button onClick={handleCloseModal} className={MailStyle.closeBtn}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MailForm;
