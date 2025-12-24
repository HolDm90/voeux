export interface GreetingItem {
  id: string;
  style: string;
  message: string;
  message_en: string; // Ajouté pour correspondre au JSON
}

interface GreetingsData {
  christmas: GreetingItem[];
  newyear: GreetingItem[];
}

let cachedGreetings: GreetingsData | null = null;

export async function getRandomGreeting(
  type: 'christmas' | 'newyear', 
  lang: 'fr' | 'en', 
  id?: string | null
): Promise<GreetingItem> {
  
  if (!cachedGreetings) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const res = await fetch(`${baseUrl}/data/voeux.json`);
    if (!res.ok) throw new Error("Impossible de charger les vœux");
    cachedGreetings = await res.json();
  }

  // Correction : on accède directement au tableau du type (christmas ou newyear)
  const allMessages = cachedGreetings![type];

  let selectedItem: GreetingItem;

  // 1. Chercher par ID si fourni
  if (id) {
    const found = allMessages.find(m => m.id === id);
    selectedItem = found || allMessages[Math.floor(Math.random() * allMessages.length)];
  } else {
    // 2. Sinon, prendre au hasard
    const randomIndex = Math.floor(Math.random() * allMessages.length);
    selectedItem = allMessages[randomIndex];
  }

  // 3. Transformation pour le composant : on place la bonne langue dans la clé "message"
  // On crée une copie pour ne pas corrompre le cache
  return {
    ...selectedItem,
    message: lang === 'en' ? selectedItem.message_en : selectedItem.message
  };
}
