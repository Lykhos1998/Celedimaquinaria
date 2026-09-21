"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearMiPermiso } from "@/app/(app)/mi-cuenta/actions";
import { TIPO_PERMISO_LABEL } from "@/lib/rh";
import type { TipoPermiso } from "@prisma/client";

const TIPOS = Object.keys(TIPO_PERMISO_LABEL) as TipoPermiso[];

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

export function MiPermisoForm() {
  const [tipo, setTipo] = useState<TipoPermiso>("VACACIONES");
  const [fechaInicio, setFechaInicio] = useState(hoy());
  const [fechaFin, setFechaFin] = useState(hoy());
  const [motivo, setMotivo] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!fechaInicio || !fechaFin) return;
    startTransition(async () => {
      await crearMiPermiso({ tipo, fechaInicio, fechaFin, motivo: motivo || undefined });
      setMotivo("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Solicitar permiso o vacaciones</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPermiso)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_PERMISO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Desde</label>
          <input
            required
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Hasta</label>
          <input
            required
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Motivo (opcional)</label>
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Detalle"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar solicitud a RH"}
      </button>
    </form>
  );
}
