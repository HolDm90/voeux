import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';

// On initialise les polices UNE SEULE FOIS avec les variables CSS
export const titleFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-title",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // On injecte les variables dans l'élément html
    <html lang="fr" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body className={`${bodyFont.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
