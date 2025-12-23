export type GreetingType = "christmas" | "newyear";

export function getGreetingType(): GreetingType {
  const today = new Date();
  const month = today.getMonth(); // 11 = Décembre, 0 = Janvier
  const day = today.getDate();

  // --- NOËL ---
  // Du 1er décembre au 30 décembre inclus
  if (month === 11 && day <= 30) {
    return "christmas";
  }

  // --- NOUVEL AN ---
  // Du 31 décembre (00h00) au 15 janvier inclus
  if ((month === 11 && day === 31) || (month === 0 && day <= 15)) {
    return "newyear";
  }

  // Par défaut pour le reste de l'année
  return "newyear";
}
