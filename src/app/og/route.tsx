import { ImageResponse } from "next/og";
import { getGreetingType } from "@/lib/getGreetingType";
import { GreetingItem } from "@/lib/getRandomGreeting";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams, origin } = new URL(request.url);
    const name = searchParams.get("name") || "Mon ami";
    const id = searchParams.get("id"); // On récupère l'ID du vœu
    
    const type = getGreetingType(); 
    const isChristmas = type === "christmas";

    // Chargement du vœu spécifique depuis le JSON
    // Note : En Edge Runtime, on utilise l'URL absolue (origin)
    const res = await fetch(`${origin}/data/voeux.json`);
    const data = await res.json();
    const messages: GreetingItem[] = data[type];
    
    // On cherche le message par ID, sinon on prend le premier par défaut
    const selectedGreeting = messages.find(m => m.id === id) || messages[0];
    const messageText = selectedGreeting?.message || "Meilleurs vœux !";

    return new ImageResponse(
      (
        <div
          style={{
            width: "1200px",
            height: "630px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: isChristmas 
              ? "linear-gradient(135deg, #b91c1c, #7f1d1d)" 
              : "linear-gradient(135deg, #0f172a, #1e293b)",
            color: "white",
            textAlign: "center",
            padding: "80px",
          }}
        >
          {/* Émoji dynamique */}
          <div style={{ fontSize: 80, marginBottom: 20 }}>
            {isChristmas ? "🎄" : "🎆"}
          </div>

          {/* Titre avec le Nom */}
          <div style={{ fontSize: 60, fontWeight: 800, marginBottom: 20 }}>
            {isChristmas ? `Joyeux Noël, ${name} !` : `Bonne Année 2026, ${name} !`}
          </div>
          
          {/* LE MESSAGE EXACT DU VŒU PARTAGÉ */}
          <div style={{ 
            fontSize: 32, 
            opacity: 0.95,
            maxWidth: '900px',
            lineHeight: 1.4,
            display: 'flex',
            justifyContent: 'center'
          }}>
            {messageText}
          </div>

          {/* Branding */}
          <div style={{ 
            position: 'absolute', 
            bottom: 40, 
            fontSize: 22, 
            opacity: 0.6,
            border: '1px solid rgba(255,255,255,0.3)',
            padding: '8px 24px',
            borderRadius: '50px'
          }}>
            voeux-gold.vercel.app
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (e) {
    return new Response(`Erreur de génération d'image`, { status: 500 });
  }
}
