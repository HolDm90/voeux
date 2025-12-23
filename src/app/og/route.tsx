import { ImageResponse } from "next/og";
import { getGreetingType } from "@/lib/getGreetingType"; // Assurez-vous que cet utilitaire fonctionne côté Edge

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name") || "Mon ami";
  
  // En 2025, on détecte dynamiquement la période
  const type = getGreetingType(); 
  const isChristmas = type === "christmas";

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
            ? "linear-gradient(135deg, #b91c1c, #7f1d1d)" // Rouge Noël
            : "linear-gradient(135deg, #0f172a, #1e293b)", // Bleu nuit Nouvel An
          color: "white",
          textAlign: "center",
          padding: "60px",
        }}
      >
        {/* Décoration symbolique */}
        <div style={{ fontSize: 80, marginBottom: 20 }}>
          {isChristmas ? "🎄" : "🎆"}
        </div>

        <div style={{ fontSize: 70, fontWeight: 800 }}>
          {isChristmas ? `Joyeux Noël, ${name} !` : `Bonne Année 2026, ${name} !`}
        </div>
        
        <div style={{ 
          fontSize: 32, 
          marginTop: 30, 
          opacity: 0.9,
          maxWidth: '800px',
          lineHeight: 1.4
        }}>
          {isChristmas 
            ? "Que cette fête soit remplie de joie et de paix." 
            : "Que cette nouvelle année vous apporte bonheur et réussite."}
        </div>

        {/* Branding discret */}
        <div style={{ 
          position: 'absolute', 
          bottom: 40, 
          fontSize: 24, 
          opacity: 0.6,
          border: '1px solid rgba(255,255,255,0.3)',
          padding: '8px 20px',
          borderRadius: '50px'
        }}>
          Généré sur votre-site.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
