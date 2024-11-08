"use client"
import { useEffect, useState } from "react";
import Modal from "../QuantifyModal/Modal";
import TermInvestmentStyle from "./TermInvestment.module.scss";

const TermInvestment = ({ userId, investmentLevel, session }) => {
  const [investmentDetails, setInvestmentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [quantifyAllowed, setQuantifyAllowed] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    window.location.reload();
  }

  const handleInvestmentDetails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/termInvestment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result.success) {
        setInvestmentDetails(result.investmentDetails);
      } else {
        setError(result.message || "Failed to fetch current fund");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleInvestmentDetails();
  }, [userId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {investmentLevel === "Starter" ? (
        <div className={TermInvestmentStyle.starter}>
          <h2>Starter</h2>
          {investmentDetails ? (
            <div className={TermInvestmentStyle.subWrapper}>
              <div>
                <p>Yatırılan Tutar</p>
                <p>{investmentDetails.amount}</p>
              </div>
              <div>
                <p>Günlük Kazanç Oranı</p>
                <p>{investmentDetails.daily_return}%</p> 
              </div>
              <div>
                <p>Bitiş Tarihi</p>
                <p>
                  {new Date(investmentDetails.end_date).toLocaleDateString("tr-TR")} 
                </p>
              </div>
              <div>
                <p>Kalan Ölçüm</p>
                <p>{investmentDetails.left_quantify_number}</p>
              </div>
            </div>
          ) : (
            <div>Investment details not available</div>
          )}
          <div className={TermInvestmentStyle.quantifyWrapper}>
            <button className={TermInvestmentStyle.quantifyBtn} onClick={openModal}>
              Ölçüm
            </button>
          </div>
        </div>
      ) : investmentLevel === "Mid" ? (
        <div className={TermInvestmentStyle.mid}>
          <h2>Mid</h2>
          {investmentDetails ? (
            <div className={TermInvestmentStyle.subWrapper}>
              <div>
                <p>Yatırılan Tutar</p>
                <p>{investmentDetails.amount}</p> 
              </div>
              <div>
                <p>Günlük Kazanç Oranı</p>
                <p>{investmentDetails.daily_return}%</p> 
              </div>
              <div>
                <p>Bitiş Tarihi</p>
                <p>
                  {new Date(investmentDetails.end_date).toLocaleDateString("tr-TR")} 
                </p>
              </div>
              <div>
                <p>Kalan Ölçüm</p>
                <p>{investmentDetails.left_quantify_number}</p> 
              </div>
            </div>
          ) : (
            <div>Investment details not available</div>
          )}
          <div className={TermInvestmentStyle.quantifyWrapper}>
            <button className={TermInvestmentStyle.quantifyBtn} onClick={openModal}>
              Ölçüm
            </button>
          </div>
        </div>
      ) : investmentLevel === "Pro" ? (
        <div className={TermInvestmentStyle.pro}>
          <h2>Pro</h2>
          {investmentDetails ? (
            <div className={TermInvestmentStyle.subWrapper}>
              <div>
                <p>Yatırılan Tutar</p>
                <p>{investmentDetails.amount}</p> 
              </div>
              <div>
                <p>Günlük Kazanç Oranı</p>
                <p>{investmentDetails.daily_return}%</p> 
              </div>
              <div>
                <p>Bitiş Tarihi</p>
                <p>
                  {new Date(investmentDetails.end_date).toLocaleDateString("tr-TR")} 
                </p>
              </div>
              <div>
                <p>Kalan Ölçüm</p>
                <p>{investmentDetails.left_quantify_number}</p> 
              </div>
            </div>
          ) : (
            <div>Investment details not available</div>
          )}
          <div className={TermInvestmentStyle.quantifyWrapper}>
            <button className={TermInvestmentStyle.quantifyBtn} onClick={openModal}>
              Ölçüm
            </button>
          </div>
        </div>
      ) : (
        <div>Invalid investment level</div>
      )}

      {investmentDetails && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          userId={userId}
          amount={parseFloat(investmentDetails.amount)}
          quantifyNumber={investmentDetails.quantify_number}
          leftQuantifyNumber={investmentDetails.left_quantify_number}
          dailyReturn={investmentDetails.daily_return}
          modalMessage={modalMessage}
          quantifyAllowed={quantifyAllowed}
        />
      )}
      {error && <div>{error}</div>}
    </div>
  );
};

export default TermInvestment;
