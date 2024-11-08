"use client";
import React, { useState } from "react";
import styles from "./Modal.module.scss";

const Modal = ({
  isOpen,
  onClose,
  userId,
  amount,
  quantifyNumber,
  leftQuantifyNumber,
  dailyReturn,
  modalMessage,
  quantifyAllowed,
}) => {
  if (!isOpen) return null;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleQuantify = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/quantify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount,
          quantifyNumber,
          leftQuantifyNumber,
          dailyReturn,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (modalMessage) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>{modalMessage}</p>
          <button className={styles.Button} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Beyond Daily Quantify</h3>
          <p>Tron Ağı ödül uygunluğu test ediliyor...</p>
          <p>Ödülünüz hazırlanıyor...</p>
          <div className={styles.spinner}></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <p>Hata: {error}</p>
          <button className={styles.Button} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3>Tron ağı başarılı!</h3>
          <p>Ödülünüz hesabınıza tanımlandı</p>
          <button className={styles.Button} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Ölçüm işlemi yap</h3>
        <p>Bu işlem Tron ağı üzerinden gerçekleştirilecektir.</p>
        <div className={styles.btnWrapper}>
          <button className={styles.Button} onClick={handleQuantify}>
            Ölçüm Başlat
          </button>
          <button className={styles.Button} onClick={onClose}>
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
