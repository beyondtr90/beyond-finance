"use client";
import React, { useState, useEffect } from "react";
import WithdrawalStyles from "./Withdrawals.module.scss";

function Withdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await fetch("/api/managerApis/getWithdrawals");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setWithdrawals(data);
      } catch (error) {
        setError("Failed to load Withdraw");
        console.error("Error fetching Withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

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

  return (
    <div>
      <h1>Withdrawal List ({withdrawals.length || 0})</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {withdrawals.length > 0 ? (
            <table className={WithdrawalStyles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdraw, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{withdraw.user_id}</td>
                    <td>{withdraw.phone}</td>
                    <td>{withdraw.amount}</td>
                    <td>{withdraw.status}</td>
                    <td>{withdraw.address}</td>
                    <td>{formatDate(withdraw.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Withdraw found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Withdrawals;
