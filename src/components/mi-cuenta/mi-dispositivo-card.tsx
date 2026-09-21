"use client";

import { useTransition } from "react";
import { solicitarSalidaMiDispositivo } from "@/app/(app)/mi-cuenta/actions";
import { TIPO_DISPOSITIVO_LABEL } from "@/lib/sistemas-ti";
import { formatFechaHora } from "@/lib/format";
import type { TipoDispositivo } from "@prisma/client";

export type MiDispositivoRow = {
  id: string;
  codigo: string;
  tipo: TipoDispositivo;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  fechaAsignacion: Date | null;
  tieneValeAbierto: boolean;
};

export function MiDispositivoCard({ dispositivo }: { dispositivo: MiDispositivoRow }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">
          {dispositivo.marca} {dispositivo.modelo}
        </p>
        <p className="text-xs text-muted">
          {TIPO_DISPOSITIVO_LABEL[dispositivo.tipo]} · {dispositivo.codigo}
          {dispositivo.numeroSerie && ` · S/N ${dispositivo.numeroSerie}`}
        </p>
        {dispositivo.fechaAsignacion && (
          <p className="text-xs text-muted">Asignado desde {formatFechaHora(dispositivo.fechaAsignacion)}</p>
        )}
      </div>
      <button
        disabled={pending || dispositivo.tieneValeAbierto}
        onClick={() => startTransition(() => solicitarSalidaMiDispositivo(dispositivo.id))}
        className="shrink-0 rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
      >
        {dispositivo.tieneValeAbierto ? "Ya tiene una solicitud en curso" : "Solicitar salida"}
      </button>
    </div>
  );
}
