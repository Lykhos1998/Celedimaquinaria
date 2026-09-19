"use client";

import { useMemo, useState, useTransition, type FormEvent } from "react";
import { crearReporte } from "@/app/(app)/danos/actions";

export type EquipoOption = { id: string; codigo: string; marca: string; modelo: string };
export type ContratoOption = { id: string; folio: string; equipoId: string; clienteNombre: string };

export function ReporteForm({ equipos, contratos }: { equipos: EquipoOption[]; contratos: ContratoOption[] }) {
  const [equipoId, setEquipoId] = useState(equipos[0]?.id ?? "");
  const [contratoId, setContratoId] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [pending, startTransition] = useTransition();

  const contratosDelEquipo = useMemo(
    () => contratos.filter((c) => c.equipoId === equipoId),
    [contratos, equipoId],
  );

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!equipoId) return;
    startTransition(async () => {
      await crearReporte({ equipoId, contratoId: contratoId || undefined, observaciones: observaciones || undefined });
      setObservaciones("");
      setContratoId("");
    });
  }

  if (equipos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Nuevo reporte de inspección</h3>
        <p className="text-sm text-muted">No hay unidades en el catálogo de Equipos/Flota.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo reporte de inspección</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Unidad</label>
          <select
            value={equipoId}
            onChange={(e) => {
              setEquipoId(e.target.value);
              setContratoId("");
            }}
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
          <label className="mb-1 block text-xs font-medium text-muted">Contrato de renta (opcional)</label>
          <select
            value={contratoId}
            onChange={(e) => setContratoId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Sin contrato asociado</option>
            {contratosDelEquipo.map((c) => (
              <option key={c.id} value={c.id}>
                {c.folio} — {c.clienteNombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Observaciones generales</label>
          <input
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Checklist de recepción"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Registrar inspección"}
      </button>
    </form>
  );
}
