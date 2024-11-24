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
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(""); // Reset error message

    const availability = {
      date,
      startTime: `${startTimeHour}:${startTimeMinute}`,
      endTime: `${endTimeHour}:${endTimeMinute}`,
    };

    try {
      const response = await fetch("https://hugo.ngrok.io/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(availability),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add availability");
      }

      alert("Disponibilité ajoutée avec succès !");
      setDate("");
      setStartTimeHour("00");
      setStartTimeMinute("00");
      setEndTimeHour("00");
      setEndTimeMinute("00");
      router.push("/doctor"); // Redirect back to the médecin page
    } catch (error) {
      console.error("Erreur lors de l'ajout de la disponibilité :", error);
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/doctor")}>Retour à la vue du médecin</button>
      <h1 className="title">Ajouter une disponibilité</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="date">Date :</label>
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
          <label>Heure de début :</label>
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
          <label>Heure de fin :</label>
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
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="button">Ajouter la disponibilité</button>
      </form>
    </div>
  );
}