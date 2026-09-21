"use client";

import { useState, useTransition, type FormEvent } from "react";
import { generarNomina } from "@/app/(app)/rh/actions";

export type ColaboradorOption = { id: string; nombre: string };

function inicioDeMes() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}

function hoy() {
  return new Date().toISOString().slice(0, 10);
}

export function NominaForm({ colaboradores }: { colaboradores: ColaboradorOption[] }) {
  const [colaboradorId, setColaboradorId] = useState(colaboradores[0]?.id ?? "");
  const [periodoInicio, setPeriodoInicio] = useState(inicioDeMes());
  const [periodoFin, setPeriodoFin] = useState(hoy());
  const [sueldoPeriodo, setSueldoPeriodo] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!colaboradorId || !periodoInicio || !periodoFin || !sueldoPeriodo) return;
    startTransition(async () => {
      await generarNomina({
        colaboradorId,
        periodoInicio,
        periodoFin,
        sueldoPeriodo: Number(sueldoPeriodo),
      });
      setSueldoPeriodo("");
    });
  }

  if (colaboradores.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Generar nómina</h3>
        <p className="text-sm text-muted">Da de alta al menos un colaborador antes de generar nómina.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Generar nómina</h3>
      <p className="mb-3 text-xs text-muted">
        Los días asistidos se calculan solos a partir de las checadas de Vigilancia en el periodo.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Colaborador</label>
          <select
            value={colaboradorId}
            onChange={(e) => setColaboradorId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Periodo desde</label>
          <input
            required
            type="date"
            value={periodoInicio}
            onChange={(e) => setPeriodoInicio(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Periodo hasta</label>
          <input
            required
            type="date"
            value={periodoFin}
            onChange={(e) => setPeriodoFin(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Sueldo del periodo (MXN)</label>
          <input
            required
            type="number"
            min={0}
            value={sueldoPeriodo}
            onChange={(e) => setSueldoPeriodo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="8000"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Generando…" : "Generar nómina"}
      </button>
    </form>
  );
}
