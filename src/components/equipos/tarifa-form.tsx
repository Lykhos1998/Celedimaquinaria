"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearTarifa } from "@/app/(app)/equipos/actions";

export function TarifaForm() {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [clasificacion, setClasificacion] = useState("");
  const [alturaCapacidad, setAlturaCapacidad] = useState("");
  const [precioMensual, setPrecioMensual] = useState("");
  const [precioDia1, setPrecioDia1] = useState("");
  const [precioDia7, setPrecioDia7] = useState("");
  const [precioDia15, setPrecioDia15] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!marca.trim() || !modelo.trim() || !clasificacion.trim()) return;
    startTransition(async () => {
      await crearTarifa({
        marca,
        modelo,
        clasificacion,
        alturaCapacidad: alturaCapacidad || undefined,
        precioMensual: Number(precioMensual),
        precioDia1: Number(precioDia1),
        precioDia7: Number(precioDia7),
        precioDia15: Number(precioDia15),
      });
      setMarca("");
      setModelo("");
      setClasificacion("");
      setAlturaCapacidad("");
      setPrecioMensual("");
      setPrecioDia1("");
      setPrecioDia7("");
      setPrecioDia15("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nueva tarifa</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Marca</label>
          <input
            required
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Caterpillar"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Modelo</label>
          <input
            required
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="320D"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Clasificación</label>
          <input
            required
            value={clasificacion}
            onChange={(e) => setClasificacion(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Excavadora mediana"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Altura / capacidad</label>
          <input
            value={alturaCapacidad}
            onChange={(e) => setAlturaCapacidad(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="10 m"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Precio mensual</label>
          <input
            required
            type="number"
            min={0}
            value={precioMensual}
            onChange={(e) => setPrecioMensual(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="45000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tarifa día 1</label>
          <input
            required
            type="number"
            min={0}
            value={precioDia1}
            onChange={(e) => setPrecioDia1(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="3500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tarifa día 7</label>
          <input
            required
            type="number"
            min={0}
            value={precioDia7}
            onChange={(e) => setPrecioDia7(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="18000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tarifa día 15</label>
          <input
            required
            type="number"
            min={0}
            value={precioDia15}
            onChange={(e) => setPrecioDia15(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="30000"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar tarifa"}
      </button>
    </form>
  );
}
