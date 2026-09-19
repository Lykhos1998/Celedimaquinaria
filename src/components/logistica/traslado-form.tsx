"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearTraslado } from "@/app/(app)/logistica/actions";
import { TIPO_MOVIMIENTO_LABEL } from "@/lib/logistica";
import type { TipoMovimiento } from "@prisma/client";

const TIPOS = Object.keys(TIPO_MOVIMIENTO_LABEL) as TipoMovimiento[];

export type EquipoOption = { id: string; codigo: string; marca: string; modelo: string };
export type CamionOption = { id: string; placa: string; modelo: string | null };

function ahoraLocalISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function TrasladoForm({ equipos, camiones }: { equipos: EquipoOption[]; camiones: CamionOption[] }) {
  const [equipoId, setEquipoId] = useState(equipos[0]?.id ?? "");
  const [camionId, setCamionId] = useState(camiones[0]?.id ?? "");
  const [tipoMovimiento, setTipoMovimiento] = useState<TipoMovimiento>("ENTREGA");
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [fechaProgramada, setFechaProgramada] = useState(ahoraLocalISO());
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!equipoId || !camionId || !origen.trim() || !destino.trim()) return;
    startTransition(async () => {
      await crearTraslado({ equipoId, camionId, tipoMovimiento, origen, destino, fechaProgramada });
      setOrigen("");
      setDestino("");
    });
  }

  if (equipos.length === 0 || camiones.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Nuevo traslado</h3>
        <p className="text-sm text-muted">
          {camiones.length === 0
            ? "Registra al menos un camión activo en Flotilla antes de programar un traslado."
            : "No hay unidades en el catálogo de Equipos/Flota."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo traslado</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Unidad</label>
          <select
            value={equipoId}
            onChange={(e) => setEquipoId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {equipos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.codigo} — {eq.marca} {eq.modelo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Camión</label>
          <select
            value={camionId}
            onChange={(e) => setCamionId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {camiones.map((c) => (
              <option key={c.id} value={c.id}>
                {c.placa} {c.modelo ? `— ${c.modelo}` : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Movimiento</label>
          <select
            value={tipoMovimiento}
            onChange={(e) => setTipoMovimiento(e.target.value as TipoMovimiento)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_MOVIMIENTO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Origen</label>
          <input
            required
            value={origen}
            onChange={(e) => setOrigen(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Patio Celedi"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Destino</label>
          <input
            required
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Obra cliente"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Fecha programada</label>
          <input
            required
            type="datetime-local"
            value={fechaProgramada}
            onChange={(e) => setFechaProgramada(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Programando…" : "Programar traslado"}
      </button>
    </form>
  );
}
