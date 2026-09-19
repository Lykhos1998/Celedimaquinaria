"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearValeSalida } from "@/app/(app)/vigilancia/actions";

export function ValeForm({
  colaboradores,
}: {
  colaboradores: { id: string; nombre: string }[];
}) {
  const [activo, setActivo] = useState("");
  const [solicitanteId, setSolicitanteId] = useState(colaboradores[0]?.id ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!solicitanteId) return;
    startTransition(async () => {
      await crearValeSalida(activo, solicitanteId);
      setActivo("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo vale de salida</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Activo</label>
          <input
            required
            value={activo}
            onChange={(e) => setActivo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Laptop Dell / herramienta / etc."
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Colaborador</label>
          <select
            value={solicitanteId}
            onChange={(e) => setSolicitanteId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear vale"}
      </button>
    </form>
  );
}
