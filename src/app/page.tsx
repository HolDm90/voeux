/* "use client";

import { useEffect, useRef, useState } from "react";
import NameInput from "@/components/NameInput";
import FestiveEffect from "@/components/FestiveEffect";
import GreetingCard from "@/components/GreetingCard";
import { Button } from "@/components/ui/button";
import { RefreshCw, Download, Share2 } from "lucide-react";
import { toPng } from "html-to-image";
import { getGreetingType } from "@/lib/getGreetingType";
import { getRandomGreeting } from "@/lib/getRandomGreeting";

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [type, setType] = useState<"christmas" | "newyear">("christmas");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Déterminer le type dès le montage du composant pour le fond et les effets
  useEffect(() => {
    setType(getGreetingType());
  }, []);

  const fetchNewMessage = async (currentType: "christmas" | "newyear") => {
    setLoading(true);
    const msg = await getRandomGreeting(currentType);
    setMessage(msg);
    setLoading(false);
  };

  useEffect(() => {
    if (!name) return;
    fetchNewMessage(type);
  }, [name, type]);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `carte-${name}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Erreur téléchargement:", err);
    }
  };

  const shareCard = async () => {
    const text = type === "christmas" ? `🎄 Joyeux Noël ${name} !` : `🎆 Bonne année ${name} !`;
    const shareData = { 
      title: "Ma Carte de vœux", 
      text: `${text}\n\n${message}`, 
      url: window.location.href 
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { console.log("Annulé"); }
    } else {
      alert("Partage non supporté. Copiez le message : \n\n" + message);
    }
  };

  // 1. Écran de saisie du nom (avec le bon fond et effet dès le début)
  if (!name) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${
        type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"
      }`}>
        <FestiveEffect type={type} />
        <NameInput onSubmit={setName} />
      </main>
    );
  }

  // 2. État de chargement initial
  if (!message && loading) {
    return (
      <main className={`min-h-screen flex items-center justify-center text-white font-title text-xl ${
        type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"
      }`}>
        Préparation de votre surprise...
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 transition-colors duration-500 overflow-hidden ${
        type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"
      }`}>
      
      <FestiveEffect type={type} />
      
      <GreetingCard ref={cardRef} name={name} type={type} message={message} />

      <div className="z-10 flex flex-col gap-3 w-full max-w-sm">
        <Button 
          variant="secondary" 
          onClick={() => fetchNewMessage(type)}
          disabled={loading}
          className="w-full bg-white/20 hover:bg-white/30 border-white/40 backdrop-blur-sm text-white"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Autre message
        </Button>

        <div className="flex gap-3">
          <Button onClick={downloadCard} className="flex-1 bg-christmas-gold text-black hover:bg-christmas-gold/90">
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>

          <Button onClick={shareCard} variant="outline" className="flex-1 border-white text-white hover:bg-white/10">
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
        </div>
      </div>
    </main>
  );
}
 */

/* "use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import GreetingCard from "@/components/GreetingCard";
import NameInput from "@/components/NameInput";
import FestiveEffect from "@/components/FestiveEffect";
import { getGreetingType } from "@/lib/getGreetingType";
import { getRandomGreeting } from "@/lib/getRandomGreeting";
import { Button } from "@/components/ui/button";
import { Share2, Download } from "lucide-react";
import { toPng } from "html-to-image";

export default function HomePage() {
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState<string | null>(null);
  const [type, setType] = useState<"christmas" | "newyear">("christmas");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // 1. Déterminer la période (Noël ou Nouvel An)
    const currentType = getGreetingType();
    setType(currentType);

    // 2. Vérifier si un nom est présent dans l'URL
    const urlName = searchParams.get("name");
    if (urlName) {
      setName(urlName);
      // 3. Charger un vœu aléatoire pour ce nom
      getRandomGreeting(currentType).then(setMessage);
    }
  }, [searchParams]);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `carte-${name}.png`;
    link.href = dataUrl;
    link.click();
  };

  // Écran de saisie
  if (!name) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center overflow-hidden ${type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"}`}>
        <FestiveEffect type={type} />
        <NameInput onSubmit={setName} />
      </main>
    );
  }

  // Écran de la carte
  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 ${type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"}`}>
      <FestiveEffect type={type} />
      
      <GreetingCard ref={cardRef} name={name} type={type} message={message} />

      <div className="z-10 flex gap-3 w-full max-w-sm">
        <Button onClick={downloadCard} className="flex-1">
          <Download className="mr-2 h-4 w-4" /> Télécharger
        </Button>
        <Button 
          onClick={() => navigator.share?.({ title: "Ma Carte", url: window.location.href })} 
          variant="outline" 
          className="flex-1"
        >
          <Share2 className="mr-2 h-4 w-4" /> Partager l'URL
        </Button>
      </div>
    </main>
  );
}
 */


/* "use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useRef, Suspense } from "react";
import GreetingCard from "@/components/GreetingCard";
import NameInput from "@/components/NameInput";
import FestiveEffect from "@/components/FestiveEffect";
import { getGreetingType } from "@/lib/getGreetingType";
import { getRandomGreeting } from "@/lib/getRandomGreeting";
import { Button } from "@/components/ui/button";
import { Share2, Download, RefreshCw } from "lucide-react";
import { toPng } from "html-to-image";

// Composant interne qui gère la logique des paramètres d'URL
function GreetingManager() {
  const searchParams = useSearchParams();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const [name, setName] = useState<string | null>(null);
  const [type, setType] = useState<"christmas" | "newyear">("christmas");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNewMessage = async (currentType: "christmas" | "newyear") => {
    setLoading(true);
    const msg = await getRandomGreeting(currentType);
    setMessage(msg);
    setLoading(false);
  };

  useEffect(() => {
    const currentType = getGreetingType();
    setType(currentType);

    const urlName = searchParams.get("name");
    if (urlName) {
      setName(urlName);
      fetchNewMessage(currentType);
    }
  }, [searchParams]);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = `carte-${name}.png`;
    link.href = dataUrl;
    link.click();
  };

  if (!name) {
    return (
      <main className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-500 ${type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"}`}>
        <FestiveEffect type={type} />
        <NameInput onSubmit={setName} />
      </main>
    );
  }

  return (
    <main className={`relative min-h-screen flex flex-col items-center justify-center gap-6 px-4 transition-colors duration-500 ${type === "christmas" ? "bg-christmas-bg" : "bg-newyear-bg"}`}>
      <FestiveEffect type={type} />
      
      <GreetingCard ref={cardRef} name={name} type={type} message={message} />

      <div className="z-10 flex flex-col gap-3 w-full max-w-sm">
        <Button 
          variant="secondary" 
          onClick={() => fetchNewMessage(type)}
          disabled={loading}
          className="bg-white/20 hover:bg-white/30 text-white border-white/40"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Autre message
        </Button>

        <div className="flex gap-3">
          <Button onClick={downloadCard} className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Télécharger
          </Button>
          <Button 
            onClick={() => navigator.share?.({ title: `Carte pour ${name}`, url: window.location.href })} 
            variant="outline" 
            className="flex-1 border-white text-white hover:bg-white/10"
          >
            <Share2 className="mr-2 h-4 w-4" /> Partager
          </Button>
        </div>
      </div>
    </main>
  );
}

export async function generateMetadata({ searchParams }: { searchParams: { name?: string } }) {
  const name = searchParams.name || "Mon ami";
  const ogUrl = new URL("votre-domaine.com");
  ogUrl.searchParams.set("name", name);

  return {
    title: `Carte de vœux pour ${name}`,
    description: "Créez et partagez votre carte de vœux personnalisée",
    openGraph: {
      images: [ogUrl.toString()],
    },
    twitter: {
      card: "summary_large_image",
      images: [ogUrl.toString()],
    },
  };
}

// L'export par défaut est BIEN un composant React
export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <GreetingManager />
    </Suspense>
  );
} */


  // app/page.tsx
import { Suspense } from "react";
import GreetingManager from "@/components/GreetingManager";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ name?: string }> }) {
  const params = await searchParams;
  const name = params.name || "Mon ami";
  
  // Correction de l'URL : Ajout du protocole https://
  // En production, remplacez par votre vrai domaine
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://votre-domaine.com";
  const ogUrl = new URL(`${baseUrl}/og`);
  ogUrl.searchParams.set("name", name);

  return {
    title: `Carte de vœux pour ${name}`,
    description: "Créez et partagez votre carte de vœux personnalisée",
    openGraph: {
      title: `Une carte de vœux pour ${name}`,
      description: "Cliquez pour voir votre message personnalisé",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Carte de vœux pour ${name}`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Carte de vœux pour ${name}`,
      images: [ogUrl.toString()],
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Chargement...
      </div>
    }>
      <GreetingManager />
    </Suspense>
  );
}
