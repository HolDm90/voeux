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
import { translations } from "@/lib/translations"; // Importez vos traductions
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw, Languages, ArrowLeft } from "lucide-react"; // Ajout d'icônes
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
    setCurrentTheme(currentType === "christmas" ? "red" : "blue");

    const urlName = searchParams.get("name");
    const urlId = searchParams.get("id");
    const urlLang = searchParams.get("lang") as "fr" | "en";

    if (urlLang && (urlLang === "fr" || urlLang === "en")) {
      setLang(urlLang);
    }

    if (urlName) {
      setName(urlName);
      if (urlId || greeting?.id) {
        fetchNewMessage(currentType, urlId || greeting?.id);
      } else {
        const saved = localStorage.getItem(`greeting_${urlName}_${currentType}`);
        if (saved && !urlId) {
          const parsed = JSON.parse(saved);
          fetchNewMessage(currentType, parsed.id);
        } else {
          fetchNewMessage(currentType);
        }
      }
    }
  }, [searchParams,  lang]);

  // IMPORTANT: On ajoute lang ici pour que le changement de langue rafraîchisse le vœu
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
    if (name) localStorage.removeItem(`greeting_${name}_${type}`);
    router.push("/");
  };

  const shareCard = async () => {
    if (!greeting || !name) return;
    // On ajoute le paramètre lang dans l'URL de partage
    const shareUrl = `${window.location.origin}/?name=${encodeURIComponent(name)}&id=${greeting.id}&lang=${lang}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Magic Wishes - ${name}`,
          text: greeting.message,
          url: shareUrl,
        });
      } catch (err) { console.log("Annulé"); }
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
      link.download = `card-${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) { console.error(error); }
  };

  if (!isMounted) return null;

  if (!name) {
    return (
      <main className={`relative min-h-screen flex flex-col items-center justify-center transition-colors duration-700 ${THEMES[currentTheme].background}`}>
        {/* Sélecteur de langue sur l'écran d'accueil */}
        <div className="absolute top-6 right-6 flex bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
          {["fr", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setLang(l as "fr" | "en")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${lang === l ? "bg-white text-black" : "text-white/60 hover:text-white"}`}
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

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 transition-colors duration-700 ${THEMES[currentTheme].background}`}>
      <FestiveEffect type={type} />
      
      {/* Bouton Retour élégant */}
      <button 
        onClick={handleBack}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 shadow-lg"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">{t.back}</span>
      </button>

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
        <div className="w-full max-w-md h-64 flex items-center justify-center bg-white/10 rounded-3xl animate-pulse text-white">{t.loading || "..."}</div>
      )}

      {/* Sélecteur de thèmes */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 justify-center p-2 bg-black/20 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key)}
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 ${currentTheme === key ? "border-white scale-125 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"} ${THEMES[key].background}`}
            />
          ))}
        </div>
        {greeting && <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">Style : {greeting.style}</span>}
      </div>

      <div className="z-10 flex flex-col gap-4 w-full max-w-sm">
        <Button
          variant="secondary"
          onClick={() => fetchNewMessage(type)}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm h-12 rounded-xl"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {t.other}
        </Button>

        <div className="flex gap-3">
          <Button onClick={downloadCard} disabled={!greeting} className="flex-1 h-12 rounded-xl shadow-xl bg-white text-black hover:bg-white/90 font-bold">
            <Download className="mr-2 h-4 w-4" /> {t.download}
          </Button>
          <Button onClick={shareCard} disabled={!greeting} variant="outline" className="flex-1 border-white/40 text-white hover:bg-white/10 h-12 rounded-xl backdrop-blur-sm">
            <Share2 className="mr-2 h-4 w-4" /> {t.share}
          </Button>
        </div>

        <footer className="mt-4 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
           <p className="text-white/30 text-[11px] tracking-wide">© 2025 — <span className="text-white/60 font-medium">DevHolvanus</span></p>
        </footer>
      </div>
    </main>
  );
}
