"use client";
import React, { useState, useEffect } from "react";
import ProStyle from "./Pro.module.scss";

function Card({ userId, invitationCode }) {
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const investmentName = "Pro";
  const dailyReturn = 10;
  const quantifyNumber = 5;
  const requiredInvitations = 8;

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
    <div className={ProStyle.cardWrapper}>
      <h2>Pro</h2>
      <div className={ProStyle.subWrapper}>
        <div>
          <p>Günlük Kazanç Oranı</p>
          <p>10%</p>
        </div>
        <div>
          <p>Gereken Davet Sayısı</p>
          <p>8</p>
        </div>
        <div>
          <p>Günlük Ölçüm Sayısı</p>
          <p>5</p>
        </div>
        <div>
          <p>Süre</p>
          <p>7 Gün</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={ProStyle.inputWrapper}>
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
        <div className={ProStyle.modal}>
          <div className={ProStyle.modalContent}>
            <p>{modalMessage}</p>
            <button onClick={closeModal}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Card;
