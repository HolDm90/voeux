"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import GreetingCard from "@/components/GreetingCard";
import NameInput from "@/components/NameInput";
import FestiveEffect from "@/components/FestiveEffect";
import { getGreetingType } from "@/lib/getGreetingType";
import { getRandomGreeting } from "@/lib/getRandomGreeting";
import { GreetingItem } from "@/lib/getRandomGreeting";
import { THEMES, ThemeKey } from "@/lib/themes";
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";

export default function GreetingManager() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState<string | null>(null);
  const [type, setType] = useState<"christmas" | "newyear">("christmas");
  const [greeting, setGreeting] = useState<GreetingItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>("red");

  useEffect(() => {
    const currentType = getGreetingType();
    setType(currentType);
    setCurrentTheme(currentType === "christmas" ? "red" : "blue");

    const urlName = searchParams.get("name");
    const urlId = searchParams.get("id");

    if (urlName) {
      setName(urlName);
      
      // 1. Priorité à l'ID dans l'URL (pour les amis qui reçoivent le lien)
      // 2. Sinon, vérifier le LocalStorage (pour vous-même)
      const saved = localStorage.getItem(`greeting_${urlName}_${currentType}`);
      
      if (urlId) {
        // On force le chargement du message spécifique
        fetchNewMessage(currentType, urlId);
      } else if (saved) {
        setGreeting(JSON.parse(saved));
      } else {
        fetchNewMessage(currentType);
      }
    }
  }, [searchParams]);

  const fetchNewMessage = async (currentType: "christmas" | "newyear", specificId?: string) => {
    setLoading(true);
    try {
      // Nous passons l'ID à notre fonction de lib si elle est équipée, 
      // sinon elle prendra au hasard
      const item = await getRandomGreeting(currentType, specificId);
      setGreeting(item);
      
      // Sauvegarde locale pour éviter le changement au refresh
      if (name) {
        localStorage.setItem(`greeting_${name}_${currentType}`, JSON.stringify(item));
      }
    } catch (error) {
      console.error("Erreur chargement vœu", error);
    } finally {
      setLoading(false);
    }
  };

  const shareCard = async () => {
    if (!greeting || !name) return;

    // On crée une URL qui contient le nom ET l'id du vœu choisi
    const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(name)}&id=${greeting.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Une carte pour ${name}`,
          text: `Découvre le vœu que j'ai choisi pour toi ! ✨`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      // Fallback : copier dans le presse-papier
      await navigator.clipboard.writeText(shareUrl);
      alert("Lien copié dans le presse-papier !");
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current || !greeting) return;

    const theme = THEMES[currentTheme];
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: [theme.accent.replace("text-", "#"), "#ffffff", "#FFD700"],
      zIndex: 999,
    });

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "transparent",
      });

      const link = document.createElement("a");
      link.download = `carte-${name || "voeux"}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Erreur lors du téléchargement", error);
    }
  };

  if (!name) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center transition-colors duration-700 ${THEMES[currentTheme].background}`}>
        <FestiveEffect type={type} />
        <NameInput onSubmit={setName} />
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 transition-colors duration-700 ${THEMES[currentTheme].background}`}>
      <FestiveEffect type={type} />

      {greeting ? (
        <GreetingCard 
          ref={cardRef} 
          name={name} 
          type={type} 
          message={greeting.message} 
          themeKey={currentTheme} 
        />
      ) : (
        <div className="w-full max-w-md h-64 flex items-center justify-center bg-white/10 rounded-3xl animate-pulse text-white">
          Magie en cours...
        </div>
      )}

      {/* Sélecteur de thèmes */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-125 ${
                currentTheme === key ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
              } ${THEMES[key].background}`}
            />
          ))}
        </div>
        {greeting && (
          <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
            Style : {greeting.style}
          </span>
        )}
      </div>

      <div className="z-10 flex flex-col gap-4 w-full max-w-sm">
        <Button
          variant="secondary"
          onClick={() => {
            localStorage.removeItem(`greeting_${name}_${type}`); // On vide le cache pour en générer un nouveau
            fetchNewMessage(type);
          }}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm h-12 rounded-xl transition-all"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Autre message
        </Button>

        <div className="flex gap-3">
          <Button 
            onClick={downloadCard} 
            disabled={!greeting} 
            className={`flex-1 h-12 rounded-xl shadow-xl transition-transform active:scale-95 font-bold ${
              currentTheme === 'gold' ? 'bg-white text-amber-900' : 'bg-white text-black'
            }`}
          >
            <Download className="mr-2 h-4 w-4" /> HD
          </Button>
          
          <Button
            onClick={shareCard}
            disabled={!greeting}
            variant="outline"
            className="flex-1 border-white/40 text-white hover:bg-white/10 h-12 rounded-xl backdrop-blur-sm"
          >
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
        </div>

        <footer className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
           <p className="text-white/30 text-[11px] tracking-wide">
             © 2025 — Créé avec ✨ par <span className="text-white/60 font-medium">DevHolvanus</span>
           </p>
        </footer>
      </div>
    </main>
  );
}
