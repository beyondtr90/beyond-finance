"use client";

import React, { useState } from "react";
import styles from "./styles.module.scss";

function Form({ userId }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Girilen şifreler uyuşmuyor!");
      setModalVisible(true);
      return;
    }

    try {
      const response = await fetch("/api/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, newPassword: password }),
      });

      const result = await response.json();
      setMessage(result.success ? "Şifreniz güncellendi" : "Şifre değiştirilemedi.");
    } catch (error) {
      setMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setMessage(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputWrapper}>
          <input
            type="text"
            placeholder="Yeni Şifre"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Yeni Şifre (Tekrar)"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles.btnWrapper}>
          <button type="submit" className={styles.submitBtn}>Kaydet</button>
        </div>
      </form>
      
      {/* Modal */}
      {modalVisible && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <p>{message}</p>
            <button onClick={closeModal}>Kapat</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Form;
