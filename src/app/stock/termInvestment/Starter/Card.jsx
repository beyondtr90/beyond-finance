"use client";
import React, { useState, useEffect } from "react";
import StarterStyle from "./Starter.module.scss";

function Card({ userId, invitationCode }) {
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const investmentName = "Starter";
  const dailyReturn = 3;
  const quantifyNumber = 3;
  const requiredInvitations = 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    await termPurchase();
  };

  const termPurchase = async () => {
    try {
      const response = await fetch("/api/termPurchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount,
          investmentName,
          dailyReturn,
          quantifyNumber,
          requiredInvitations,
          invitationCode,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setModalMessage("Yatırım Başarılı! Hemen ölçüme başlayabilirsin");
      } else {
        setModalMessage(result.message);
      }
      setShowModal(true);
    } catch (error) {
      setModalMessage("Error making investment");
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (userId) {
    }
  }, [userId]);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className={StarterStyle.cardWrapper}>
      <h2>Starter</h2>
      <div className={StarterStyle.subWrapper}>
        <div>
          <p>Günlük Kazanç Oranı</p>
          <p>3%</p>
        </div>
        <div>
          <p>Gereken Davet Sayısı</p>
          <p>0</p>
        </div>
        <div>
          <p>Günlük Ölçüm Sayısı</p>
          <p>3</p>
        </div>
        <div>
          <p>Süre</p>
          <p>7 Gün</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={StarterStyle.inputWrapper}>
          <input
            type="text"
            pattern="[0-9]+"
            placeholder="Yatırmak istediğiniz tutarı girin"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <button type="submit">Yatır</button>
        </div>
      </form>

      {showModal && (
        <div className={StarterStyle.modal}>
          <div className={StarterStyle.modalContent}>
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
