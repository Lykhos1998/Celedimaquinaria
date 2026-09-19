"use client";

import { useState, useTransition, type FormEvent } from "react";
import { registrarGasto } from "@/app/(app)/marketing/actions";
import { CANAL_LABEL } from "@/lib/comercial";
import type { CanalLead } from "@prisma/client";

const CANALES = Object.keys(CANAL_LABEL) as CanalLead[];

export function GastoForm() {
  const [plataforma, setPlataforma] = useState("");
  const [canal, setCanal] = useState<CanalLead | "">("");
  const [monto, setMonto] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!plataforma.trim() || !monto) return;
    startTransition(async () => {
      await registrarGasto({
        plataforma,
        canal: canal || undefined,
        monto: Number(monto),
      });
      setPlataforma("");
      setMonto("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Registrar gasto</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Plataforma</label>
          <input
            required
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Facebook Ads"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Canal asociado</label>
          <select
            value={canal}
            onChange={(e) => setCanal(e.target.value as CanalLead | "")}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Sin asociar</option>
            {CANALES.map((c) => (
              <option key={c} value={c}>
                {CANAL_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Monto (MXN)</label>
          <input
            required
            type="number"
            min={0}
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="1500"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar gasto"}
      </button>
    </form>
  );
}
