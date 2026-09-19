"use client";

import { useRef, useState, useTransition, type FormEvent } from "react";
import { crearDanio } from "@/app/(app)/danos/actions";
import { SEVERIDAD_DANIO_LABEL } from "@/lib/danos";
import type { SeveridadDanio } from "@prisma/client";

const SEVERIDADES = Object.keys(SEVERIDAD_DANIO_LABEL) as SeveridadDanio[];

export type ReporteOption = { id: string; folio: string; equipoCodigo: string };

export function DanioForm({ reportes, reporteIdInicial }: { reportes: ReporteOption[]; reporteIdInicial?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await crearDanio(formData);
        formRef.current?.reset();
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo registrar el daño.");
      }
    });
  }

  if (reportes.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Registrar daño</h3>
        <p className="text-sm text-muted">Primero registra un reporte de inspección en la pestaña Inspecciones.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Registrar daño</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Reporte de inspección</label>
          <select
            name="reporteId"
            defaultValue={reporteIdInicial ?? reportes[0]?.id}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {reportes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.folio} — {r.equipoCodigo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tipo de daño</label>
          <input
            required
            name="tipo"
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Golpe en carrocería"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Severidad</label>
          <select
            name="severidad"
            defaultValue="LEVE"
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {SEVERIDADES.map((s) => (
              <option key={s} value={s}>
                {SEVERIDAD_DANIO_LABEL[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Descripción</label>
          <input
            name="descripcion"
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Detalle del daño"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Costo estimado (MXN)</label>
          <input
            name="costoEstimado"
            type="number"
            min={0}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="1500"
          />
        </div>
        <div className="sm:col-span-2 lg:col-span-3">
          <label className="mb-1 block text-xs font-medium text-muted">Evidencia fotográfica (opcional, máx. 5 MB)</label>
          <input
            name="foto"
            type="file"
            accept="image/*"
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none file:mr-3 file:rounded file:border-0 file:bg-brand file:px-3 file:py-1 file:text-xs file:text-brand-foreground focus:border-brand"
          />
        </div>
      </div>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar daño"}
      </button>
    </form>
  );
}
