"use client";
import React, { useState, useEffect } from "react";
import UserStyles from "./Users.module.scss";

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Yüklenme durumu

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/managerApis/getUsers");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        setError("Failed to load users");
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
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
      <h1>Users List ({users.length || 0})</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {users.length > 0 ? (
            <table className={UserStyles.table}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>User ID</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Deposit</th>
                  <th>Balance</th>
                  <th>Blocked Amount</th>
                  <th>Investment Type</th>
                  <th>Daily Earning</th>
                  <th>Total Earning</th>
                  <th>Total Withdrawals</th>
                  <th>Joined At</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.user_id}</td>
                    <td>{user.phone}</td>
                    <td>{user.email}</td>
                    <td>{user.status === true ? "True" : "False"}</td>
                    <td>{user.deposit}</td>
                    <td>{user.balance}</td>
                    <td>{user.blocked_amount}</td>
                    <td>{user.investment_type}</td>
                    <td>{user.daily_earning}</td>
                    <td>{user.total_earning}</td>
                    <td>{user.total_withdrawal_amount}</td>
                    <td>{formatDate(user.joined_at)}</td>
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

export default Users;
