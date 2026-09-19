"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearOrdenCompra } from "@/app/(app)/compras/actions";
import { AREA_LABEL } from "@/lib/compras";
import type { AreaSolicitante } from "@prisma/client";

const AREAS = Object.keys(AREA_LABEL) as AreaSolicitante[];

export type RefaccionOption = {
  id: string;
  descripcion: string;
  cantidad: number;
  ordenFolio: string;
  equipoCodigo: string;
};

export type ProveedorOption = { id: string; nombre: string };

export function OrdenCompraForm({
  refacciones,
  proveedores,
}: {
  refacciones: RefaccionOption[];
  proveedores: ProveedorOption[];
}) {
  const [refaccionId, setRefaccionId] = useState("");
  const [area, setArea] = useState<AreaSolicitante>("TALLER");
  const [proveedorId, setProveedorId] = useState(proveedores[0]?.id ?? "");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [pending, startTransition] = useTransition();

  function handleRefaccionChange(id: string) {
    setRefaccionId(id);
    const refaccion = refacciones.find((r) => r.id === id);
    if (refaccion) {
      setArea("TALLER");
      setDescripcion(`${refaccion.descripcion} (x${refaccion.cantidad}) — ${refaccion.ordenFolio} / ${refaccion.equipoCodigo}`);
    } else {
      setDescripcion("");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!proveedorId || !descripcion.trim() || !monto) return;
    startTransition(async () => {
      await crearOrdenCompra({
        proveedorId,
        descripcion,
        monto: Number(monto),
        area,
        refaccionId: refaccionId || undefined,
      });
      setRefaccionId("");
      setDescripcion("");
      setMonto("");
    });
  }

  if (proveedores.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Nueva orden de compra</h3>
        <p className="text-sm text-muted">Registra al menos un proveedor antes de cotizar una compra.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Cotizar orden de compra</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Solicitud de Taller (opcional)</label>
          <select
            value={refaccionId}
            onChange={(e) => handleRefaccionChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Compra directa (sin solicitud de Taller)</option>
            {refacciones.map((r) => (
              <option key={r.id} value={r.id}>
                {r.ordenFolio} — {r.descripcion} (x{r.cantidad})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Área</label>
          <select
            value={area}
            disabled={!!refaccionId}
            onChange={(e) => setArea(e.target.value as AreaSolicitante)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand disabled:opacity-60"
          >
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {AREA_LABEL[a]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Proveedor</label>
          <select
            value={proveedorId}
            onChange={(e) => setProveedorId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {proveedores.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Descripción</label>
          <input
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Qué se compra"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Monto cotizado (MXN)</label>
          <input
            required
            type="number"
            min={0}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="4500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar a aprobación de Dirección"}
      </button>
    </form>
  );
}
