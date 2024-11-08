import React from "react";
import "./Modal.scss";

const SuccessModal = ({ isOpen, onClose, modalType }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">
          {modalType === "success"
            ? "Satın Alma Başarılı!"
            : "Satın Alma Başarısız!"}
        </h2>
        <p className="modal-message">
          {modalType === "success"
            ? "Yatırım Fonunuz ve günlük geliriniz güncellendi."
            : "Bakiyenizi kontrol edin."}
        </p>
        <button className="modal-close-button" onClick={onClose}>
          Tamam
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
