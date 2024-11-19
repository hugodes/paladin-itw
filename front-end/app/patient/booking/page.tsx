"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { reasonMapping } from "../../lib/reasonMapping"; 
import "../../styles/booking.css"; 

export default function Booking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const startTime = searchParams.get("startTime");
  const endTime = searchParams.get("endTime");
  const id = searchParams.get("id");

  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  const handleConfirm = async () => {
    try {
      const response = await fetch(`http://localhost:3001/availability/${id}/book`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, comment }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      alert(`Appointment booked for ${date} from ${startTime} to ${endTime}`);
      router.push("/patient"); // Redirect back to the patient page
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Confirm Booking</h1>
      <div className="booking-info">
        <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Start Time:</strong> {startTime}</p>
        <p><strong>End Time:</strong> {endTime}</p>
      </div>
      <div className="form-group">
        <label htmlFor="reason">Reason:</label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="form-control"
        >
          <option value="" disabled>Select a reason</option>
          {Object.entries(reasonMapping).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="comment">Comment (optional):</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="button-container">
        <button className="button" onClick={handleConfirm}>Confirm</button>
        <button className="button" onClick={() => router.push("/patient")}>Cancel</button>
      </div>
    </div>
  );
}