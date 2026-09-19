"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearRefaccion } from "@/app/(app)/taller/actions";

export type OrdenOption = { id: string; folio: string; equipoCodigo: string };

export function RefaccionForm({ ordenes, ordenIdInicial }: { ordenes: OrdenOption[]; ordenIdInicial?: string }) {
  const [ordenServicioId, setOrdenServicioId] = useState(ordenIdInicial ?? ordenes[0]?.id ?? "");
  const [descripcion, setDescripcion] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!ordenServicioId || !descripcion.trim()) return;
    startTransition(async () => {
      await crearRefaccion(ordenServicioId, descripcion, Number(cantidad));
      setDescripcion("");
      setCantidad("1");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Solicitar refacción</h3>
      {ordenes.length === 0 ? (
        <p className="text-sm text-muted">No hay órdenes de servicio abiertas para solicitar refacciones.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted">Orden de servicio</label>
              <select
                value={ordenServicioId}
                onChange={(e) => setOrdenServicioId(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              >
                {ordenes.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.folio} — {o.equipoCodigo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Refacción</label>
              <input
                required
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                placeholder="Filtro de aceite"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Cantidad</label>
              <input
                required
                type="number"
                min={1}
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
                className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Solicitando…" : "Solicitar"}
          </button>
        </>
      )}
    </form>
  );
}
