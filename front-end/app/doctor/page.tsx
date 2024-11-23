"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { reasonMapping } from "../lib/reasonMapping"; 

const fetchAllAvailabilities = async () => {
  const response = await fetch("http://localhost:3001/availabilities", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Auth": "doctor",
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch availabilities");
  }
  return response.json();
};

export default function Doctor() {
  const router = useRouter();
  const [availabilities, setAvailabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAvailabilities = async () => {
    try {
      const slots = await fetchAllAvailabilities();
      setAvailabilities(slots);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAvailabilities();
  }, []);

  return (
    <div className="container">
      <button className="back-button" onClick={() => router.push("/")}>Retour à l'accueil</button>
      <h1 className="title">Vue du médecin</h1>
      <button className="add-button" onClick={() => router.push("/doctor/add-availability")}>+</button>
      {loading && <div>Chargement...</div>}
      {error && <div>Erreur : {error}</div>}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heure de début</th>
            <th>Heure de fin</th>
            <th>Réservé</th>
            <th>Raison</th>
            <th>Commentaire</th>
          </tr>
        </thead>
        <tbody>
          {availabilities.map((slot, index) => (
            <tr key={index} className="availability-item">
              <td>{new Date(slot.date).toLocaleDateString()}</td>
              <td>{slot.startTime}</td>
              <td>{slot.endTime}</td>
              <td className={slot.booked ? 'booked' : 'available'}>
                {slot.booked ? "Oui" : "Non"}
              </td>
              <td>{reasonMapping[slot.reason] || "--"}</td>
              <td>{slot.comment || "--"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}