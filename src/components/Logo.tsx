// src/components/Logo.tsx
import { titleFont } from "@/lib/fonts";

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      {/* Petit symbole graphique (optionnel) */}
      <div className="w-1 h-1 bg-christmas-gold rounded-full mb-2 animate-pulse shadow-[0_0_10px_#FFD700]" />
      
      <h1 className={`${titleFont.className} text-white/40 text-sm font-bold uppercase tracking-[0.3em] transition-all hover:text-white/60 hover:tracking-[0.4em] cursor-default`}>
        LUMINA WISHES
      </h1>
      
      {/* Ligne subtile en dessous */}
      <div className="w-8 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent mt-1" />
    </div>
  );
}
