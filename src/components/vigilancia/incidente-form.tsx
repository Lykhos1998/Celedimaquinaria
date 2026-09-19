"use client";

import { useState, useTransition, type FormEvent } from "react";
import { registrarIncidente } from "@/app/(app)/vigilancia/actions";
import type { SeveridadIncidente } from "@prisma/client";

export function IncidenteForm() {
  const [descripcion, setDescripcion] = useState("");
  const [severidad, setSeveridad] = useState<SeveridadIncidente>("BAJA");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!descripcion.trim()) return;
    startTransition(async () => {
      await registrarIncidente(descripcion, severidad);
      setDescripcion("");
      setSeveridad("BAJA");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Registrar incidente / ronda</h3>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-xs font-medium text-muted">Descripción</label>
          <input
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Detalle del incidente o ronda de seguridad"
          />
        </div>
        <div className="sm:w-40">
          <label className="mb-1 block text-xs font-medium text-muted">Severidad</label>
          <select
            value={severidad}
            onChange={(e) => setSeveridad(e.target.value as SeveridadIncidente)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar"}
      </button>
    </form>
  );
}
