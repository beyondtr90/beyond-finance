"use client";
import React, { useState, useEffect } from "react";
import Requeststyles from "./Requests.module.scss";

function Requests() {
  const [Requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(`${URL}/api/managerApis/getRequests`);

        if (!response.ok) {
          throw new Error("Failed to fetch Requests");
        }

        const data = await response.json();
        setRequests(data);
      } catch (error) {
        setError("Failed to load Requests");
        console.error("Error fetching Requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
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

  const handleReject = async (user) => {
    try {
      const response = await fetch(`${URL}/api/managerApis/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          phone: user.phone,
          amount: user.amount,
          user_balance: user.user_balance,
          address: user.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reject request");
      }

      // Remove the rejected request from the Requests state
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.user_id !== user.user_id)
      );
    } catch (error) {
      setError("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };
  const handleSend = async (user) => {
    try {
      const response = await fetch(`${URL}/api/managerApis/transfer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          phone: user.phone,
          amount: user.amount,
          address: user.address,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to transfer request");
      }

      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.user_id !== user.user_id)
      );
    } catch (error) {
      setError("Failed to reject request");
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div>
      <h1>Requests List ({Requests.length || 0})</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {Requests.length > 0 ? (
            <table className={Requeststyles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Amount</th>
                  <th>Total Balance</th>
                  <th>Address</th>
                  <th>Created At</th>
                  <th>Send</th>
                </tr>
              </thead>
              <tbody>
                {Requests.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.user_id}</td>
                    <td>{user.phone}</td>
                    <td>{user.amount}</td>
                    <td>{user.user_balance}</td>
                    <td>{user.address}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td className={Requeststyles.btnWr}>
                      <button
                        onClick={() => handleSend(user)}
                        className={Requeststyles.okBtn}
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleReject(user)}
                        className={Requeststyles.rejectBtn}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Requests found.</p>
          )}
        </>
      )}
    </div>
  );
}

export default Requests;
