// src/app/layout.tsx
import "./globals.css";
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { titleFont, bodyFont } from "@/lib/fonts"; // Import depuis le nouveau fichier

export const metadata: Metadata = {
  title: 'Lumina Wishes - Vœux Magiques 2026',
  description: 'Générez des vœux uniques et personnalisés pour Noël et le Nouvel An.',
  openGraph: {
    title: 'Lumina Wishes - Partagez la Magie',
    description: 'Créez votre carte de vœux personnalisée en un clic.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${titleFont.variable} ${bodyFont.variable}`}>
      <body className={`${bodyFont.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
