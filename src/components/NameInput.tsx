"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { translations } from "@/lib/translations";
import Logo from "@/components/Logo"; // Assurez-vous que le fichier existe dans /components
import { getGreetingType } from "@/lib/getGreetingType";

interface NameInputProps {
  onSubmit: (name: string) => void;
  lang: "fr" | "en";
}

export default function NameInput({ onSubmit, lang }: NameInputProps) {
  const [value, setValue] = useState("");
  const router = useRouter();
  const type = getGreetingType(); // Détecte si on est sur Noël ou Nouvel An
  
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    router.push(`/?name=${encodeURIComponent(value.trim())}&lang=${lang}`);
    onSubmit(value.trim());
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
      {/* 1. Logo Lumina Wishes */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo />
      </motion.div>

      {/* 2. Section Description Dynamique */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-white/90"
      >
        <h2 className="font-title text-3xl md:text-4xl mb-4 text-christmas-gold">
          {type === "christmas" 
            ? (lang === "fr" ? "Partagez la magie de Noël" : "Share the Christmas Magic")
            : (lang === "fr" ? "Célébrez l'année 2026" : "Celebrate Year 2026")
          }
        </h2>
        <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto opacity-80">
          {lang === "fr" 
            ? "Utilisez notre bibliothèque pour générer un message unique parmi 2000 vœux originaux." 
            : "Use our library to generate a unique message from 2,000 original wishes."}
          <br />
          {lang === "fr"
            ? "Personnalisez, téléchargez et envoyez vos vœux en un instant."
            : "Personalize, download and send your wishes in an instant."}
        </p>
      </motion.section>

      {/* 3. Formulaire de saisie */}
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20 flex flex-col gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-white text-xl font-title text-center">
            {t.title}
          </h1>
          <p className="text-white/60 text-sm text-center">
            {lang === "fr" ? "Prêt à commencer ?" : "Ready to start?"}
          </p>
        </div>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.placeholder}
          className="text-center bg-white/95 text-black h-12 rounded-full border-none text-lg shadow-inner focus:ring-2 focus:ring-christmas-gold"
          autoFocus
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform active:scale-95"
        >
          {t.buttonView}
        </Button>
      </motion.form>

      {/* 4. Footer */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/40 text-xs uppercase tracking-[0.2em]"
      >
        {lang === "fr" ? "Gratuit • Personnalisable • HD" : "Free • Customizable • HD"}
      </motion.p>
    </div>
  );
}
