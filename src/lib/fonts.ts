// src/lib/fonts.ts
import { Playfair_Display, Inter } from "next/font/google";

export const titleFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-title",
});

export const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
