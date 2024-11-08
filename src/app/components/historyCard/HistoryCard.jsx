"use client";
import React, { useState, useEffect } from "react";
import CardStyles from "./historyCard.module.scss";

function HistoryCard({ userId }) {
  const [requests, setRequests] = useState(null);
  const [withdrawals, setWithdrawals] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const result = await response.json();

      if (result) {
        setWithdrawals(result.withdrawals);
        setRequests(result.requests);
      } else {
        setError("Failed to fetch current fund");
      }
    } catch (error) {
      setError(error.error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleHistory();
  }, [userId]);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {requests.map((request, index) => (
        <div key={index} className={CardStyles.historyCard}>
          <p>Durum:</p>
          <div className={CardStyles.statusWr}>
            <p>İşleniyor .</p>
            <p className={CardStyles.greenDot}></p>
          </div>
          <p>Miktar:</p>
          <p>${request.amount}</p>
          <p>Tarih:</p>
          <p>{formatDate(request.created_at)}</p>
          <p>Adres:</p>
          <p>{request.address}</p>
        </div>
      ))}
      {withdrawals.map((withdraw, index) => (
        <div key={index} className={CardStyles.historyCard}>
          <p>Durum:</p>
          <div className={CardStyles.statusWr}>
            <p>{withdraw.status}</p>
          </div>
          <p>Miktar:</p>
          <p>${withdraw.amount}</p>
          <p>Tarih:</p>
          <p>{formatDate(withdraw.created_at)}</p>
          <p>Adres:</p>
          <p>{withdraw.address}</p>
        </div>
      ))}
    </>
  );
}

export default HistoryCard;
