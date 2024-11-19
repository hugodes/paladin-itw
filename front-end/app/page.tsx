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
      <h1 className="title">Welcome to Paladin</h1>
      <div className="button-container">
        <button className="button" onClick={goToDoctorView}>
          Doctor's View
        </button>
        <button className="button" onClick={goToPatientView}>
          Patient's View
        </button>
      </div>
    </div>
  );
}