import { diasRestantes, formatTrialHasta } from "@/lib/trial";

export function TrialBanner() {
  const hasta = formatTrialHasta();
  const dias = diasRestantes();
  if (!hasta) return null;

  return (
    <div className="flex shrink-0 items-center justify-center gap-1.5 bg-amber-500/10 px-4 py-1.5 text-center text-xs text-amber-500">
      <span>
        Versión de prueba — válida hasta el {hasta}
        {dias !== null && ` (${dias} ${dias === 1 ? "día" : "días"})`}. Contacta a Lykhos para activarla.
      </span>
    </div>
  );
}
