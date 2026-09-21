"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearCuentaCobrar } from "@/app/(app)/finanzas/actions";
import { CONCEPTO_COBRO_LABEL } from "@/lib/finanzas";
import type { ConceptoCobro } from "@prisma/client";

const CONCEPTOS = Object.keys(CONCEPTO_COBRO_LABEL) as ConceptoCobro[];

export type ContratoOption = {
  id: string;
  folio: string;
  clienteNombre: string;
  valorMensual: number;
};

export type DanioOption = {
  id: string;
  tipo: string;
  reporteFolio: string;
  equipoCodigo: string;
  costoEstimado: number;
};

function fechaEnDias(dias: number) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
}

export function CuentaCobrarForm({
  contratos,
  danios,
}: {
  contratos: ContratoOption[];
  danios: DanioOption[];
}) {
  const [origen, setOrigen] = useState("");
  const [concepto, setConcepto] = useState<ConceptoCobro>("OTRO");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState(fechaEnDias(5));
  const [pending, startTransition] = useTransition();

  function handleOrigenChange(value: string) {
    setOrigen(value);

    if (value.startsWith("contrato:")) {
      const contrato = contratos.find((c) => `contrato:${c.id}` === value);
      if (contrato) {
        setConcepto("RENTA_MENSUAL");
        setDescripcion(`Renta mensual — ${contrato.folio} (${contrato.clienteNombre})`);
        setMonto(String(contrato.valorMensual));
      }
      return;
    }

    if (value.startsWith("danio:")) {
      const danio = danios.find((d) => `danio:${d.id}` === value);
      if (danio) {
        setConcepto("DANO");
        setDescripcion(`Daño — ${danio.tipo} (${danio.reporteFolio} / ${danio.equipoCodigo})`);
        setMonto(String(danio.costoEstimado));
      }
      return;
    }

    setConcepto("OTRO");
    setDescripcion("");
    setMonto("");
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!descripcion.trim() || !monto || !fechaVencimiento) return;

    const [tipo, id] = origen.includes(":") ? origen.split(":") : [null, null];

    startTransition(async () => {
      await crearCuentaCobrar({
        concepto,
        descripcion,
        monto: Number(monto),
        fechaVencimiento,
        contratoId: tipo === "contrato" ? (id ?? undefined) : undefined,
        danioId: tipo === "danio" ? (id ?? undefined) : undefined,
      });
      setOrigen("");
      setConcepto("OTRO");
      setDescripcion("");
      setMonto("");
      setFechaVencimiento(fechaEnDias(5));
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Registrar cuenta por cobrar</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Origen del cobro</label>
          <select
            value={origen}
            onChange={(e) => handleOrigenChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Cobro manual (otro)</option>
            {contratos.length > 0 && (
              <optgroup label="Renta mensual — contratos activos">
                {contratos.map((c) => (
                  <option key={c.id} value={`contrato:${c.id}`}>
                    {c.folio} — {c.clienteNombre} (${c.valorMensual.toLocaleString("es-MX")})
                  </option>
                ))}
              </optgroup>
            )}
            {danios.length > 0 && (
              <optgroup label="Daños por cobrar">
                {danios.map((d) => (
                  <option key={d.id} value={`danio:${d.id}`}>
                    {d.reporteFolio} / {d.equipoCodigo} — {d.tipo} (${d.costoEstimado.toLocaleString("es-MX")})
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Concepto</label>
          <select
            value={concepto}
            disabled={!!origen}
            onChange={(e) => setConcepto(e.target.value as ConceptoCobro)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand disabled:opacity-60"
          >
            {CONCEPTOS.map((c) => (
              <option key={c} value={c}>
                {CONCEPTO_COBRO_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Vence</label>
          <input
            required
            type="date"
            value={fechaVencimiento}
            onChange={(e) => setFechaVencimiento(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Descripción</label>
          <input
            required
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Qué se cobra"
          />
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
            placeholder="12000"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Registrar cuenta por cobrar"}
      </button>
    </form>
  );
}
