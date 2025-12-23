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

export async function getRandomGreeting(type: 'christmas' | 'newyear'): Promise<GreetingItem> {
  if (!cachedGreetings) {
    const res = await fetch("/data/voeux.json");
    cachedGreetings = await res.json();
  }

  const messages = cachedGreetings![type];
  const randomIndex = Math.floor(Math.random() * messages.length);
  
  // On retourne l'objet complet au lieu de juste le texte
  return messages[randomIndex];
}
