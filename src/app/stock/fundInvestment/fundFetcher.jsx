"use client";
import React, { useEffect, useState } from "react";
import FundCard from "../../components/FundCard/FundCard";
import SuccessModal from "../../components/successPurchaseModal/Modal";

function FundFetcher({ userId, currentFund }) {
  const [funds, setFunds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("fail");

  useEffect(() => {
    const fetchFunds = async () => {
      try {
        const response = await fetch("/api/fund");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFunds(data[0].funds);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchFunds();
  }, []);

  const handlePurchase = async (fundId, price) => {
    try {
      const response = await fetch("/api/fundPurchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          fundId: fundId,
          price: price,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setModalType("success");
        setIsModalOpen(true);
      } else {
        setModalType("fail");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Satın alma hatası:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {funds.map((fund) => (
        <div key={fund.id}>
          <FundCard
            fundId={fund.id}
            fundName={fund.fund_name}
            price={parseFloat(fund.price)}
            dailyEarning={parseFloat(fund.daily_return)}
            currentFund={currentFund}
            onClick={() => handlePurchase(fund.id, parseFloat(fund.price))}
          />
        </div>
      ))}
      <SuccessModal modalType={modalType} isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

export default FundFetcher;
