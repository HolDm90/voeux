export type ThemeKey = "red" | "green" | "gold" | "blue" | "dark";

export const THEMES: Record<
  ThemeKey,
  {
    label: string;
    background: string;
    card: string;
    accent: string;
  }
> = {
  red: {
    label: "Rouge festif",
    background:
      "bg-gradient-to-br from-red-900 via-red-800 to-rose-900",
    card: "bg-white/15",
    accent: "text-amber-200",
  },
  green: {
    label: "Vert sapin",
    background:
      "bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-950",
    card: "bg-white/15",
    accent: "text-emerald-200",
  },
  gold: {
    label: "Or élégant",
    background:
      "bg-gradient-to-br from-yellow-700 via-amber-700 to-orange-800",
    card: "bg-white/15",
    accent: "text-yellow-200",
  },
  blue: {
    label: "Bleu nuit",
    background:
      "bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950",
    card: "bg-white/15",
    accent: "text-sky-200",
  },
  dark: {
    label: "Noir chic",
    background:
      "bg-gradient-to-br from-neutral-900 via-zinc-900 to-black",
    card: "bg-white/10",
    accent: "text-neutral-200",
  },
};
