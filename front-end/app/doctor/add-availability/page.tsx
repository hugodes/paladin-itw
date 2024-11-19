"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddAvailability() {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [startTimeHour, setStartTimeHour] = useState("00");
  const [startTimeMinute, setStartTimeMinute] = useState("00");
  const [endTimeHour, setEndTimeHour] = useState("00");
  const [endTimeMinute, setEndTimeMinute] = useState("00");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const availability = {
      date,
      startTime: `${startTimeHour}:${startTimeMinute}`,
      endTime: `${endTimeHour}:${endTimeMinute}`,
    };

    try {
      const response = await fetch("http://localhost:3001/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availability),
      });

      if (!response.ok) {
        throw new Error("Failed to add availability");
      }

      alert("Availability added successfully");
      setDate("");
      setStartTimeHour("00");
      setStartTimeMinute("00");
      setEndTimeHour("00");
      setEndTimeMinute("00");
      router.push("/doctor"); // Redirect back to the doctor page
    } catch (error) {
      console.error("Error adding availability:", error);
      alert("Failed to add availability");
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/doctor")}>Back to Doctor's View</button>
      <h1 className="title">Add Availability</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <div className="time-select">
            <select
              id="startTimeHour"
              value={startTimeHour}
              onChange={(e) => setStartTimeHour(e.target.value)}
              required
              className="form-control"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              id="startTimeMinute"
              value={startTimeMinute}
              onChange={(e) => setStartTimeMinute(e.target.value)}
              required
              className="form-control"
            >
              {["00", "15", "30", "45"].map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <div className="time-select">
            <select
              id="endTimeHour"
              value={endTimeHour}
              onChange={(e) => setEndTimeHour(e.target.value)}
              required
              className="form-control"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, "0")}>
                  {String(i).padStart(2, "0")}
                </option>
              ))}
            </select>
            :
            <select
              id="endTimeMinute"
              value={endTimeMinute}
              onChange={(e) => setEndTimeMinute(e.target.value)}
              required
              className="form-control"
            >
              {["00", "15", "30", "45"].map((minute) => (
                <option key={minute} value={minute}>
                  {minute}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="button">Add Availability</button>
      </form>
    </div>
  );
}