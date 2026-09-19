"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearCamion } from "@/app/(app)/logistica/actions";

export function CamionForm() {
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!placa.trim()) return;
    startTransition(async () => {
      await crearCamion({ placa, modelo: modelo || undefined, capacidad: capacidad || undefined });
      setPlaca("");
      setModelo("");
      setCapacidad("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo camión</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Placa</label>
          <input
            required
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="ABC-1234"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Modelo</label>
          <input
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Kenworth T800"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Capacidad</label>
          <input
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="10 ton"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar camión"}
      </button>
    </form>
  );
}
