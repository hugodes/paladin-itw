"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const fetchAvailableAvailabilities = async () => {
  const response = await fetch("http://localhost:3001/availabilities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Auth": "patient",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch available availabilities");
  }
  return response.json();
};

export default function Patient() {
  const router = useRouter();
  const [availableAvailabilities, setAvailableAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvailabilities = async () => {
    try {
      const slots = await fetchAvailableAvailabilities();
      console.log(slots);
      setAvailableAvailabilities(slots);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  const handleClick = (slot: any) => {
    const query = new URLSearchParams({
      id: slot.id,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    }).toString();
    router.push(`/patient/booking?${query}`);
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/")}>Back to Landing</button>
      <h1 className="title">Available Availabilities</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {availableAvailabilities.map((slot, index) => (
            <tr key={index} className="availability-item">
              <td>{new Date(slot.date).toLocaleDateString()}</td>
              <td>{slot.startTime}</td>
              <td>{slot.endTime}</td>
              <td>
                <button className="button" onClick={() => handleClick(slot)}>Book</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}