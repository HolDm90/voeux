"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { translations } from "@/lib/translations"; // Importez vos traductions

interface NameInputProps {
  onSubmit: (name: string) => void;
  lang: "fr" | "en";
}

export default function NameInput({ onSubmit, lang }: NameInputProps) {
  const [value, setValue] = useState("");
  const router = useRouter();
  
  // Utilisation du dictionnaire selon la langue passée par le parent
  const t = translations[lang];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    router.push(`/?name=${encodeURIComponent(value.trim())}&lang=${lang}`);
    onSubmit(value.trim());
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
      
      {/* 1. La Section Description (Traduite) */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white/90"
      >
        <h2 className="font-title text-3xl md:text-4xl mb-4 text-christmas-gold">
          {lang === "fr" ? "Partagez la magie de Noël" : "Share the Christmas Magic"}
        </h2>
        <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto opacity-80">
          {lang === "fr" 
            ? "Utilisez notre bibliothèque de vœux pour générer un message unique parmi 2000 vœux originaux." 
            : "Use our greeting library to generate a unique message from 2,000 original wishes."}
          <br />
          {lang === "fr"
            ? "Personnalisez, téléchargez et envoyez vos vœux en un instant."
            : "Personalize, download and send your wishes in an instant."}
        </p>
      </motion.section>

      {/* 2. Le Formulaire de saisie (Traduit via le dico) */}
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
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
          className="text-center bg-white/95 text-black h-12 rounded-full border-none text-lg shadow-inner"
          autoFocus
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform active:scale-95"
        >
          {t.buttonView}
        </Button>
      </motion.form>

      {/* 3. Petit Footer (Traduit) */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/40 text-xs uppercase tracking-widest"
      >
        {lang === "fr" ? "Gratuit • Personnalisable • HD" : "Free • Customizable • HD"}
      </motion.p>
    </div>
  );
}
