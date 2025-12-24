"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { titleFont, bodyFont } from "@/lib/fonts";
import { THEMES, ThemeKey } from "@/lib/themes";

interface GreetingCardProps {
  name: string;
  message: string;
  type: "christmas" | "newyear";
  themeKey: ThemeKey;
  title: string;
}

const GreetingCard = forwardRef<HTMLDivElement, GreetingCardProps>(
  ({ name, message, type, themeKey, title }, ref) => {
    const theme = THEMES[themeKey];
    const isChristmas = type === "christmas";

    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`relative w-full max-w-md rounded-3xl p-8 text-center shadow-2xl overflow-hidden border border-white/20 ${theme.background}`}
      >
        {/* Effet visuel de profondeur */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        
        {/* TITRE DYNAMIQUE */}
        <h1 className={`${titleFont.className} text-4xl text-white mb-4`}>
          {title}
        </h1>

        {/* PRÉNOM AVEC ACCENT DU THÈME */}
        <p className={`${titleFont.className} text-2xl mb-6 ${theme.accent}`}>
          {name}
        </p>

        {/* MESSAGE DEPUIS LE JSON (2000 VOEUX) */}
        <p className={`${bodyFont.className} text-white/95 text-lg leading-relaxed`}>
          {message}
        </p>

        {/* ÉMOJIS DYNAMIQUES */}
        <div className="mt-8 text-3xl opacity-80">
          {isChristmas ? "🎄 ✨ 🎁" : "🎆 🥂 ✨"}
        </div>

        {/* Finition design */}
        <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
      </motion.div>
    );
  }
);

GreetingCard.displayName = "GreetingCard";

export default GreetingCard;
