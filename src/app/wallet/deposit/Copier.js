"use client";
import React, { useState, useEffect } from "react";

function Copier({ depositAdress }) {
  const textToCopy = depositAdress;
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Kopyalama işlemi başarısız:", err);
      });
  };

  return (
    <div id="deposit-address" onClick={handleCopy} style={{ cursor: "pointer" }}>
      <span onClick={handleCopy}>{textToCopy}</span>
      <img
        src="https://img.icons8.com/material-rounded/24/copy.png"
        alt="copy"
      />
      {isCopied && (
        <div className="modal">
          <p>Metin kopyalandı!</p>
        </div>
      )}
      <style jsx>{`
        .modal {
          position: fixed;
          top: 40vh;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 10px 20px;
          border-radius: 5px;
          z-index: 1000;
        }
        #deposit-address {
          display: flex;
          justify-content: space-around;
          width: 100%;
          padding: 8px 0px;
          background-color: #a8db2f;
          margin-bottom: 2em;
          font-size: 0.9rem;
          border-radius: 5px;
        }
        img {
          width: 1.5em;
          height: 1.5em;
        }
      `}</style>
    </div>
  );
}

export default Copier;
