"use client";

import { useState, useTransition } from "react";
import {
  avanzarEtapa,
  marcarGanado,
  marcarPerdido,
  actualizarTemperatura,
} from "@/app/(app)/ventas/actions";
import { Modal } from "@/components/modal";
import { ETAPAS_PIPELINE, TEMPERATURA_LABEL, TEMPERATURA_STYLE } from "@/lib/comercial";
import type { EtapaLead, Temperatura } from "@prisma/client";

export type LeadCardData = {
  id: string;
  folio: string;
  nombre: string;
  valorEstimado: number | null;
  temperatura: Temperatura;
  etapa: EtapaLead;
  asesorNombre: string | null;
};

const TEMPERATURAS = Object.keys(TEMPERATURA_LABEL) as Temperatura[];
const MOTIVOS_PERDIDA = ["Precio / flete", "Sin proyecto", "Busca proveedor local", "Otro"];

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function en30DiasISO() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export function KanbanCard({ lead }: { lead: LeadCardData }) {
  const [pending, startTransition] = useTransition();
  const [dialog, setDialog] = useState<"ganado" | "perdido" | null>(null);

  const idx = ETAPAS_PIPELINE.indexOf(lead.etapa);

  function mover(delta: number) {
    const siguiente = ETAPAS_PIPELINE[idx + delta];
    if (!siguiente) return;
    startTransition(() => avanzarEtapa(lead.id, siguiente));
  }

  function cambiarTemperatura() {
    const orden = TEMPERATURAS;
    const siguiente = orden[(orden.indexOf(lead.temperatura) + 1) % orden.length];
    startTransition(() => actualizarTemperatura(lead.id, siguiente));
  }

  return (
    <div className="rounded-lg border border-border bg-surface-muted p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-mono text-[10px] text-muted">{lead.folio}</p>
          <p className="text-sm font-medium text-foreground">{lead.nombre}</p>
        </div>
        <button
          disabled={pending}
          onClick={cambiarTemperatura}
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${TEMPERATURA_STYLE[lead.temperatura]}`}
          title="Cambiar temperatura"
        >
          {TEMPERATURA_LABEL[lead.temperatura]}
        </button>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-muted">
        <span>{lead.asesorNombre ?? "Sin asignar"}</span>
        {lead.valorEstimado && <span>${lead.valorEstimado.toLocaleString("es-MX")}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-1">
        <div className="flex gap-1">
          <button
            disabled={pending || idx <= 0}
            onClick={() => mover(-1)}
            className="rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:border-brand disabled:opacity-30"
          >
            ‹
          </button>
          <button
            disabled={pending || idx >= ETAPAS_PIPELINE.length - 1}
            onClick={() => mover(1)}
            className="rounded-md border border-border px-2 py-1 text-xs text-foreground transition hover:border-brand disabled:opacity-30"
          >
            ›
          </button>
        </div>
        <div className="flex gap-1">
          <button
            disabled={pending}
            onClick={() => setDialog("perdido")}
            className="rounded-md border border-border px-2 py-1 text-xs text-red-500 transition hover:border-red-500"
          >
            Perdido
          </button>
          <button
            disabled={pending}
            onClick={() => setDialog("ganado")}
            className="rounded-md border border-border px-2 py-1 text-xs text-emerald-500 transition hover:border-emerald-500"
          >
            Ganado
          </button>
        </div>
      </div>

      <Modal open={dialog === "ganado"} onClose={() => setDialog(null)} title={`Cerrar como ganado — ${lead.folio}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            startTransition(async () => {
              await marcarGanado(lead.id, {
                valorMensual: Number(form.get("valorMensual")),
                fechaInicio: String(form.get("fechaInicio")),
                fechaFin: String(form.get("fechaFin")),
              });
              setDialog(null);
            });
          }}
          className="space-y-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Valor mensual del contrato (MXN)</label>
            <input
              required
              name="valorMensual"
              type="number"
              min={0}
              defaultValue={lead.valorEstimado ?? ""}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Fecha de inicio</label>
              <input
                required
                name="fechaInicio"
                type="date"
                defaultValue={hoyISO()}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Fecha de fin</label>
              <input
                required
                name="fechaFin"
                type="date"
                defaultValue={en30DiasISO()}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Crear contrato"}
          </button>
        </form>
      </Modal>

      <Modal open={dialog === "perdido"} onClose={() => setDialog(null)} title={`Marcar como perdido — ${lead.folio}`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.currentTarget);
            startTransition(async () => {
              await marcarPerdido(
                lead.id,
                String(form.get("motivoPerdida")),
                form.get("valorPerdido") ? Number(form.get("valorPerdido")) : undefined,
              );
              setDialog(null);
            });
          }}
          className="space-y-3"
        >
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Motivo de pérdida</label>
            <select
              name="motivoPerdida"
              defaultValue={MOTIVOS_PERDIDA[0]}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            >
              {MOTIVOS_PERDIDA.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Valor perdido (MXN)</label>
            <input
              name="valorPerdido"
              type="number"
              min={0}
              defaultValue={lead.valorEstimado ?? ""}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {pending ? "Guardando…" : "Marcar perdido"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
