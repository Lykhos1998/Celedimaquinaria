"use client";

import { useState, useTransition } from "react";
import { registrarChecada } from "@/app/(app)/vigilancia/actions";
import type { TipoChecada } from "@prisma/client";

const OPCIONES: { tipo: TipoChecada; label: string }[] = [
  { tipo: "ENTRADA", label: "Entrada" },
  { tipo: "SALIDA_COMIDA", label: "Salida a comida" },
  { tipo: "ENTRADA_COMIDA", label: "Entrada de comida" },
  { tipo: "SALIDA", label: "Salida" },
];

export function ChecadorForm({
  colaboradores,
}: {
  colaboradores: { id: string; nombre: string }[];
}) {
  const [colaboradorId, setColaboradorId] = useState(colaboradores[0]?.id ?? "");
  const [pending, startTransition] = useTransition();
  const [ultimoRegistro, setUltimoRegistro] = useState<string | null>(null);

  function registrar(tipo: TipoChecada, label: string) {
    if (!colaboradorId) return;
    startTransition(async () => {
      await registrarChecada(colaboradorId, tipo);
      const nombre = colaboradores.find((c) => c.id === colaboradorId)?.nombre;
      setUltimoRegistro(`${label} registrada para ${nombre}`);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Registrar checada</h3>
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs font-medium text-muted">Colaborador</label>
          <select
            value={colaboradorId}
            onChange={(e) => setColaboradorId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>

        {OPCIONES.map((op) => (
          <button
            key={op.tipo}
            disabled={pending || !colaboradorId}
            onClick={() => registrar(op.tipo, op.label)}
            className="rounded-md border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {op.label}
          </button>
        ))}
      </div>
      {ultimoRegistro && <p className="mt-3 text-xs text-muted">{ultimoRegistro}</p>}
    </div>
  );
}
