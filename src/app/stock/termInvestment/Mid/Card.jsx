"use client";
import React, { useState, useEffect } from "react";
import MidStyle from "./Mid.module.scss";

function Card({ userId, invitationCode }) {
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const investmentName = "Mid";
  const dailyReturn = 6;
  const quantifyNumber = 4;
  const requiredInvitations = 4;

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
    <div className={MidStyle.cardWrapper}>
      <h2>Mid</h2>
      <div className={MidStyle.subWrapper}>
        <div>
          <p>Günlük Kazanç Oranı</p>
          <p>6%</p>
        </div>
        <div>
          <p>Gereken Davet Sayısı</p>
          <p>4</p>
        </div>
        <div>
          <p>Günlük Ölçüm Sayısı</p>
          <p>4</p>
        </div>
        <div>
          <p>Süre</p>
          <p>7 Gün</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={MidStyle.inputWrapper}>
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
        <div className={MidStyle.modal}>
          <div className={MidStyle.modalContent}>
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
