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
import { translations } from "@/lib/translations";
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw, ArrowLeft } from "lucide-react";
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
  const [isMounted, setIsMounted] = useState(false);
  const [lang, setLang] = useState<"fr" | "en">("fr");

  const t = translations[lang];

  useEffect(() => {
    setIsMounted(true);
    const currentType = getGreetingType();
    setType(currentType);
    
    const urlName = searchParams.get("name");
    const urlId = searchParams.get("id");
    const urlLang = searchParams.get("lang") as "fr" | "en";

    if (urlLang && (urlLang === "fr" || urlLang === "en")) setLang(urlLang);

    if (urlName) {
      setName(urlName);
      if (urlId || greeting?.id) {
        fetchNewMessage(currentType, urlId || greeting?.id);
      } else {
        const saved = localStorage.getItem(`greeting_${urlName}_${currentType}`);
        if (saved) {
          fetchNewMessage(currentType, JSON.parse(saved).id);
        } else {
          fetchNewMessage(currentType);
        }
      }
    }
  }, [searchParams, lang]);

  const fetchNewMessage = async (currentType: "christmas" | "newyear", specificId?: string) => {
    if (!loading) setLoading(true);
    try {
      const item = await getRandomGreeting(currentType, lang, specificId);
      setGreeting(item);
      if (!specificId && name) {
        localStorage.setItem(`greeting_${name}_${currentType}`, JSON.stringify(item));
      }
    } catch (error) {
      console.error("Erreur chargement vœu", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setName(null);
    setGreeting(null);
    router.push("/");
  };

  const shareCard = async () => {
    if (!greeting || !name) return;
    const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(name)}&id=${greeting.id}&lang=${lang}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Lumina Wishes - ${name}`,
          text: greeting.message,
          url: shareUrl,
        });
      } catch (err) { console.log("Partage annulé"); }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert(lang === "fr" ? "Lien copié !" : "Link copied!");
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
    });

    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `LuminaWishes-${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) { console.error(error); }
  };

  if (!isMounted) return null;

  // ECRAN D'ACCUEIL
  if (!name) {
    return (
      <main className={`relative min-h-screen w-full flex flex-col items-center justify-center p-6 overflow-hidden transition-colors duration-700 ${THEMES[currentTheme].background}`}>
        <div className="fixed top-6 right-6 z-50 flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20 shadow-xl">
          {["fr", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as "fr" | "en")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === l ? "bg-white text-black shadow-md" : "text-white/60 hover:text-white"}`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
        <FestiveEffect type={type} />
        <NameInput onSubmit={setName} lang={lang} />
      </main>
    );
  }

  // ECRAN CARTE GENEREE
  return (
    <main className={`relative min-h-screen w-full flex flex-col items-center justify-start py-20 px-4 transition-colors duration-700 overflow-x-hidden ${THEMES[currentTheme].background}`}>
      <FestiveEffect type={type} />
      
      {/* Bouton Retour (Fixe pour mobile) */}
      <button 
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-all bg-black/20 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 shadow-lg active:scale-90"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{t.back}</span>
      </button>

      {/* Conteneur de la carte (Flexible) */}
      <div className="w-full max-w-md flex flex-col items-center gap-8 z-10">
        {greeting ? (
          <GreetingCard 
            ref={cardRef} 
            name={name} 
            type={type} 
            message={greeting.message} 
            themeKey={currentTheme} 
            title={type === "christmas" ? t.christmasTitle : t.newyearTitle}
          />
        ) : (
          <div className="w-full aspect-[4/5] flex items-center justify-center bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 animate-pulse">
            <span className="text-white/40 font-medium">{t.loading}</span>
          </div>
        )}

        {/* Sélecteur de thèmes (Responsive grid/flex) */}
        <div className="flex flex-col items-center gap-3 w-full">
          <div className="flex gap-4 justify-center p-2.5 bg-black/30 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
            {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setCurrentTheme(key)}
                className={`w-8 h-8 rounded-full border-2 transition-all duration-300 active:scale-125 ${currentTheme === key ? "border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-transparent opacity-40"}`}
                style={{ background: THEMES[key].background.split(' ').pop() }} // Approximation visuelle
              />
            ))}
          </div>
          {greeting && (
            <span className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold">
              Style: {greeting.style}
            </span>
          )}
        </div>

        {/* Actions (S'adapte à la largeur) */}
        <div className="flex flex-col gap-4 w-full">
          <Button
            variant="secondary"
            onClick={() => fetchNewMessage(type)}
            disabled={loading}
            className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md h-14 rounded-2xl transition-all active:scale-95"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            {t.other}
          </Button>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={downloadCard} 
              disabled={!greeting} 
              className="h-14 rounded-2xl shadow-xl bg-white text-black hover:bg-white/90 font-bold active:scale-95"
            >
              <Download className="mr-2 h-5 w-5" /> {t.download}
            </Button>
            <Button 
              onClick={shareCard} 
              disabled={!greeting} 
              variant="outline" 
              className="border-white/20 text-white hover:bg-white/10 h-14 rounded-2xl backdrop-blur-md active:scale-95"
            >
              <Share2 className="mr-2 h-5 w-5" /> {t.share}
            </Button>
          </div>
        </div>

        <footer className="mt-8 flex flex-col items-center opacity-30">
           <p className="text-[10px] tracking-[0.4em] text-white uppercase font-medium">
             © 2025 — DevHolvanus
           </p>
        </footer>
      </div>
    </main>
  );
}
