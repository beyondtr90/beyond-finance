import React from "react";
import styles from "./styles.module.scss";

function LoadingModal() {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <div className={styles.spinner}></div>
        <p>Yükleniyor...</p>
      </div>
    </div>
  );
}

export default LoadingModal;
