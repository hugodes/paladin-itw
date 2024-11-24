"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const goToDoctorView = () => {
    router.push("./doctor");
  };

  const goToPatientView = () => {
    router.push("./patient");
  };

  return (
    <div className="container">
      <h1 className="title">Bienvenue sur votre espace Paladin 👋</h1>
      <div className="subtitle-container">
        <h2 className="subtitle large">vous êtes: </h2>
        <div className="button-container">
          <button className="button" onClick={goToDoctorView}>
            Médecin
          </button>
          <button className="button" onClick={goToPatientView}>
            Employé.e
          </button>
        </div>
      </div>
    </div>
  );
}