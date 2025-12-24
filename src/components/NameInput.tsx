"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function NameInput({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    router.push(`/?name=${encodeURIComponent(value.trim())}`);
    onSubmit(value.trim());
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl px-4">
      
      {/* 1. La Section Description (Hors du formulaire pour la clarté) */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center text-white/90"
      >
        <h2 className="font-title text-3xl md:text-4xl mb-4 text-christmas-gold">
          Partagez la magie de Noël
        </h2>
        <p className="text-base md:text-lg leading-relaxed max-w-lg mx-auto opacity-80">
          Utilisez notre bibliothèque de vœux pour générer un message unique parmi <strong>2000 vœux originaux</strong>. 
          Personnalisez, téléchargez et envoyez vos vœux en un instant.
        </p>
      </motion.section>

      {/* 2. Le Formulaire de saisie */}
      <motion.form 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-white/20 flex flex-col gap-6"
      >
        <div className="space-y-2">
          <h1 className="text-white text-xl font-title text-center">Prêt à commencer ?</h1>
          <p className="text-white/60 text-sm text-center">Entrez votre prénom pour générer votre carte</p>
        </div>

        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ex: Paule"
          className="text-center bg-white/95 text-black h-12 rounded-full border-none text-lg shadow-inner"
          autoFocus
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-lg shadow-lg transition-transform active:scale-95"
        >
          Voir ma carte
        </Button>
      </motion.form>

      {/* 3. Petit Footer discret sous l'input */}
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-white/40 text-xs uppercase tracking-widest"
      >
        Gratuit • Personnalisable • HD
      </motion.p>
    </div>
  );
}
