"use client";
import React, { useState } from "react";

const DepositModal = ({ userId, balance }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);

  const [transactionHash, setTransactionHash] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const openModal = () => {
    setIsModalVisible(true);
  };

  const sendDepositRequest = async () => {
    setIsProcessing(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/deposit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          balance: balance,
          hash: transactionHash,
          amount: parseFloat(amount),
        }),
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        setIsSuccess(true);
      } else {
        setIsSuccess(false);
        setErrorMessage(data.message || "Deposit failed.");
      }
    } catch (error) {
      setIsSuccess(false);
      setErrorMessage("API request failed.");
    }

    setIsProcessing(false);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          openModal();
        }}
      >
        <input
          placeholder="Hash TransictionID"
          type="text"
          pattern="[a-zA-Z0-9]+"
          required
          value={transactionHash}
          onChange={(e) => setTransactionHash(e.target.value)}
        />
        <input
          placeholder="Yatırım miktarı (USDT)"
          type="text"
          pattern="[0-9]+"
          required
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Yatırım Yaptım</button>
      </form>

      {isModalVisible && (
        <div
          className="modal-overlay"
          onClick={() => !isProcessing && setIsModalVisible(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-body">
              <h2>İşleme Devam Et</h2>

              {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

              {!isProcessing && isSuccess === null && (
                <div>
                  <p>
                    Hash adresini doğru girdiğinize eminseniz onayla butonuna
                    basınız
                  </p>
                  <button onClick={sendDepositRequest}>Onayla</button>
                </div>
              )}

              {isProcessing && (
                <div>
                  <h2>İşlemde</h2>
                  <p>Tron ağı kontrol ediliyor...</p>
                  <div className="spinner"></div>
                </div>
              )}

              {!isProcessing && isSuccess && (
                <div>
                  <h2>Başarılı</h2>
                  <p style={{ color: "green" }}>
                    Yatırımınız cüzdanınıza yansıtıldı!
                  </p>
                </div>
              )}

              {!isProcessing && isSuccess === false && (
                <div>
                  <p style={{ color: "red" }}>
                    Yatırım başarısız oldu. Lütfen tekrar deneyin.
                  </p>
                  <button
                    onClick={() => {
                      if (!isProcessing) {
                        setIsModalVisible(false);
                        window.location.reload();
                      }
                    }}
                  >
                    Kapat
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        input {
          width: 100%;
          padding: 10px 5px;
          font-size: 1rem;
          border-radius: 7px;
          background-color: #fff;
          color: #000000;
          border: none;
          margin-bottom: 2em;
        }
        input:focus {
          outline: none;
        }
        h2 {
          margin-bottom: 1em;
        }
        p {
          margin-bottom: 1.5em;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          padding: 0vh 5vw;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 100%;
          position: relative;
        }
        .modal-body {
          text-align: center;
          margin-top: 10px;
        }

        .spinner {
          border: 4px solid rgba(0, 0, 0, 0.1);
          border-left-color: #09f;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          margin: 20px auto;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        button[disabled] {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default DepositModal;
