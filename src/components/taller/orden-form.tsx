"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearOrden } from "@/app/(app)/taller/actions";
import { TIPO_SERVICIO_LABEL } from "@/lib/taller";
import type { TipoServicio } from "@prisma/client";

const TIPOS = Object.keys(TIPO_SERVICIO_LABEL) as TipoServicio[];

export type EquipoOption = { id: string; codigo: string; marca: string; modelo: string };
export type ReporteDanoOption = {
  id: string;
  folio: string;
  equipoId: string;
  equipoCodigo: string;
  resumenDanos: string;
};

export function OrdenForm({
  equipos,
  reportesConDanos,
}: {
  equipos: EquipoOption[];
  reportesConDanos: ReporteDanoOption[];
}) {
  const [equipoId, setEquipoId] = useState(equipos[0]?.id ?? "");
  const [tipo, setTipo] = useState<TipoServicio>("PREVENTIVO");
  const [descripcion, setDescripcion] = useState("");
  const [reporteInspeccionId, setReporteInspeccionId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleReporteChange(id: string) {
    setReporteInspeccionId(id);
    const reporte = reportesConDanos.find((r) => r.id === id);
    if (reporte) {
      setEquipoId(reporte.equipoId);
      setTipo("CORRECTIVO");
      setDescripcion(`Reparar daños de ${reporte.folio}: ${reporte.resumenDanos}`);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!equipoId || !descripcion.trim()) return;
    startTransition(async () => {
      await crearOrden({ equipoId, tipo, descripcion, reporteInspeccionId: reporteInspeccionId || undefined });
      setDescripcion("");
      setReporteInspeccionId("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nueva orden de servicio</h3>
      {equipos.length === 0 ? (
        <p className="text-sm text-muted">
          Todas las unidades tienen una orden abierta. Completa o cancela una orden para poder abrir otra sobre esa
          unidad.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {reportesConDanos.length > 0 && (
              <div className="sm:col-span-2 lg:col-span-4">
                <label className="mb-1 block text-xs font-medium text-muted">
                  Reporte de Área de Daños sin orden (opcional)
                </label>
                <select
                  value={reporteInspeccionId}
                  onChange={(e) => handleReporteChange(e.target.value)}
                  className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                >
                  <option value="">Ninguno — orden independiente</option>
                  {reportesConDanos.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.folio} — {r.equipoCodigo}: {r.resumenDanos}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Unidad</label>
              <select
                value={equipoId}
                disabled={!!reporteInspeccionId}
                onChange={(e) => setEquipoId(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand disabled:opacity-60"
              >
                {equipos.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.codigo} — {eq.marca} {eq.modelo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as TipoServicio)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                {TIPOS.map((t) => (
                  <option key={t} value={t}>
                    {TIPO_SERVICIO_LABEL[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Descripción</label>
              <input
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                placeholder="Cambio de aceite, falla hidráulica..."
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Abriendo…" : "Abrir orden"}
          </button>
        </>
      )}
    </form>
  );
}
