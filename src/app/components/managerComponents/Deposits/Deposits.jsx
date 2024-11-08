"use client";
import React, { useState, useEffect } from "react";
import DepositsStyle from "./Deposits.module.scss";

function Deposits() {
  const [deposits, setDeposits] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await fetch(`${URL}/api/managerApis/getDeposits`);

        if (!response.ok) {
          throw new Error("failed to fetch Deposits");
        }

        const data = await response.json();
        setDeposits(data);
      } catch (error) {
        setError("failed to load deposits");
        console.error("error fetching depoists:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeposits();
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
      <h1>Deposits ({deposits.length || 0})</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {deposits.length > 0 ? (
            <table className={DepositsStyle.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>Hash (Transiction ID)</th>
                  <th>Amount</th>
                  <th>DateTime</th>
                </tr>
              </thead>
              <tbody>
                {deposits.map((deposit, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{deposit.user_id}</td>
                    <td>{deposit.hash}</td>
                    <td>{deposit.amount}</td>
                    <td>{formatDate(deposit.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Deposits;
