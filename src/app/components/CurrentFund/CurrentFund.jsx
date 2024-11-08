"use client";
import React, { useEffect, useState } from "react";
import CurrentFundStyle from "./CurrentFund.module.scss";

function CurrentFund({ investmentType }) {
  const [userCurrentFund, setUserCurrentFund] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const URL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleCurrentFund = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${URL}/api/currentFund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ investmentType }),
      });

      const result = await response.json();

      if (result.success) {
        setUserCurrentFund(result.fundDetails);
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
    handleCurrentFund();
  }, [investmentType]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {userCurrentFund && userCurrentFund.fund_name && userCurrentFund.price ? (
        <div className={CurrentFundStyle.fundWrapper}>
          <div>{userCurrentFund.fund_name}</div>
          <div>${userCurrentFund.price}</div>
          <div className={CurrentFundStyle.earningAmount}>
            ${userCurrentFund.daily_return}
          </div>
        </div>
      ) : (
        <div>Fon Bulunmuyor</div>
      )}
      {error && <div>Error: {error}</div>}
    </>
  );
}

export default CurrentFund;