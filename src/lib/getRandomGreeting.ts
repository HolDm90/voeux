// lib/getRandomGreeting.ts

export interface GreetingItem {
  id: string;
  style: string;
  message: string;
}

interface GreetingsData {
  christmas: GreetingItem[];
  newyear: GreetingItem[];
}

let cachedGreetings: GreetingsData | null = null;

export async function getRandomGreeting(type: 'christmas' | 'newyear', id?: string | null): Promise<GreetingItem> {
  if (!cachedGreetings) {
    // Utilisation de l'URL absolue en production pour éviter les erreurs de fetch relatif
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const res = await fetch(`${baseUrl}/data/voeux.json`);
    if (!res.ok) throw new Error("Impossible de charger les vœux");
    cachedGreetings = await res.json();
  }

  const messages = cachedGreetings![type];

  // Si un ID est fourni, on cherche ce vœu précis
  if (id) {
    const found = messages.find(m => m.id === id);
    if (found) return found; // Retourne le vœu spécifique
  }

  // Si pas d'ID ou ID non trouvé -> Hasard (Fallback)
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}
