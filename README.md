# ✨ Magic Wishes 2026 — Générateur de Cartes de Vœux

**Magic Wishes** est une application web moderne construite avec **Next.js 16 (App Router)** permettant de créer, personnaliser et partager des cartes de vœux élégantes pour **Noël** et le **Nouvel An**.

Chaque carte combine **design premium**, **animations subtiles** et **messages soigneusement sélectionnés** afin d’offrir une expérience mémorable et facilement partageable.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 🚀 Fonctionnalités

- 🎄 **Dynamisme saisonnier**  
  L’interface bascule automatiquement entre le thème Noël et Nouvel An selon la date.

- ✍️ **Bibliothèque de vœux assistée par IA**  
  Plus de **2000 vœux** organisés par styles (Poétique, Minimaliste, Chaleureux, etc.).

- 🎨 **Personnalisation avancée**  
  Plusieurs thèmes de couleurs dynamiques avec effet **Glassmorphism**.

- 📸 **Génération d’image**  
  Téléchargement de la carte personnalisée en **haute définition (PNG)**.

- 🔗 **Partage par URL**  
  Lien unique du type `?name=Paule&theme=green` affichant directement la carte.

- 🎆 **Animations immersives**  
  Neige optimisée (`react-snowfall`) et confettis (`canvas-confetti`).

- 🖼️ **Open Graph dynamique**  
  Aperçus personnalisés sur WhatsApp, Facebook et X (Twitter).

---

## 🛠️ Stack Technique

- **Framework** : Next.js 16 (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Animations** : Framer Motion
- **Icônes** : Lucide Icons
- **Capture d’image** : html-to-image
- **Effets visuels** : react-snowfall, canvas-confetti
- **Typographies** :
  - *Playfair Display* — Titres
  - *Inter* — Texte

---

## 🧱 Architecture du projet

app/
├─ page.tsx # Page principale
├─ og/route.ts # Génération d'images Open Graph
├─ layout.tsx
components/
├─ GreetingCard.tsx # Carte principale
├─ NameInput.tsx # Saisie du prénom
├─ ThemeSelector.tsx # Sélecteur de thème
├─ SnowEffect.tsx # Effet neige
lib/
├─ themes.ts # Configuration des thèmes
data/
├─ wishes.json # Vœux (Noël / Nouvel An)


---

## 📦 Installation

### Prérequis
- Node.js ≥ 18
- pnpm recommandé

### Étapes

```bash
git clone https://github.com/HolDm90/voeux.git
cd magic-wishes
pnpm install
pnpm dev
