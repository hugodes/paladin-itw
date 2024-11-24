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
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    if (!reason) {
      setError("La raison est obligatoire");
      return;
    }
    setLoading(true);
    setError(""); // Reset error message
    try {
      const response = await fetch(`https://hugo.ngrok.io/api/availability/${id}/book`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Network response was not ok");
      }

      const data = await response.json();
      setConfirmationMessage("✅ Réservation confirmée avec succès!");
      setTimeout(() => {
        setConfirmationMessage("");
        router.push("/patient"); // Redirect back to the employé.e page
      }, 3000); // Hide the message after 3 seconds
    } catch (error) {
      console.error("Error booking appointment:", error);
      setError(error.message || "Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {confirmationMessage && (
        <div className="confirmation-message">
          {confirmationMessage}
        </div>
      )}
      {loading && (
        <div className="modal">
          <div className="modal-content">
            <p>Réservation... 📨</p>
          </div>
        </div>
      )}
      <h1 className="title">Confirmer la réservation 📆</h1>
      <div className="booking-info">
        <p><strong>Date :</strong> {new Date(date).toLocaleDateString()}</p>
        <p><strong>Heure de début :</strong> {startTime}</p>
        <p><strong>Heure de fin :</strong> {endTime}</p>
      </div>
      <div className="form-group">
        <label htmlFor="reason">Raison <span className="required">*</span>:</label>
        <select
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          className="form-control"
        >
          <option value="" disabled>Sélectionnez une raison</option>
          {Object.entries(reasonMapping).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {error && <div className="error-message">{error}</div>}
      <div className="form-group">
        <label htmlFor="comment">Commentaire (facultatif) :</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="button-container">
        <button className="button" onClick={handleConfirm} disabled={loading}>
          {loading ? "Réservation..." : "Confirmer"}
        </button>
        <button className="button" onClick={() => router.push("/patient")} disabled={loading}>
          Annuler
        </button>
      </div>
    </div>
  );
}