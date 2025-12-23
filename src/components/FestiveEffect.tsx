/* "use client";

import Confetti from "react-confetti";
import { useEffect, useState } from "react";

interface FestiveEffectProps {
  type: "christmas" | "newyear";
}

export default function FestiveEffect({ type }: FestiveEffectProps) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Initialisation
    setSize({ width: window.innerWidth, height: window.innerHeight });

    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Empêche le rendu avant que la taille soit connue pour éviter les bugs visuels
  if (size.width === 0) return null;

  const commonProps = {
    width: size.width,
    height: size.height,
    style: { pointerEvents: "none" as const, zIndex: 50 },
    recycle: true,
  };

  if (type === "newyear") {
    return (
      <Confetti
        {...commonProps}
        numberOfPieces={150}
        gravity={0.2}
        colors={['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722']}
      />
    );
  }

  // Noël → Effet neige amélioré
  return (
    <Confetti
      {...commonProps}
      numberOfPieces={100}
      gravity={0.05} // Neige plus lente
      wind={0.01}    // Léger vent latéral
      colors={["#ffffff"]}
      drawShape={(ctx) => {
        // Dessine des flocons ronds plutôt que des carrés
        ctx.beginPath();
        ctx.arc(0, 0, 4, 0, 2 * Math.PI);
        ctx.fill();
      }}
    />
  );
}
 */

"use client";

import Snowfall from "react-snowfall";
import confetti from "canvas-confetti";
import { useEffect } from "react";

interface FestiveEffectProps {
  type: "christmas" | "newyear";
}

export default function FestiveEffect({ type }: FestiveEffectProps) {
  
  useEffect(() => {
    // Si c'est le Nouvel An, on lance une explosion au chargement
    if (type === "newyear") {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ["#FFD700", "#FFFFFF", "#00E5FF"]
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ["#FFD700", "#FFFFFF", "#00E5FF"]
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [type]);

  if (type === "christmas") {
    return (
      <Snowfall
        color="#ffffff"
        snowflakeCount={150}
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    );
  }

  return null; // Canvas-confetti gère son propre canvas par dessus
}
