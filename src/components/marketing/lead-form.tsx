"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearLead } from "@/app/(app)/marketing/actions";
import { CANAL_LABEL, TIPO_TRABAJO_LABEL } from "@/lib/comercial";
import type { CanalLead, TipoTrabajo } from "@prisma/client";

const CANALES = Object.keys(CANAL_LABEL) as CanalLead[];
const TIPOS = Object.keys(TIPO_TRABAJO_LABEL) as TipoTrabajo[];

export function LeadForm({ asesores }: { asesores: { id: string; nombre: string }[] }) {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [canal, setCanal] = useState<CanalLead>("FORMULARIO_WEB");
  const [tipoTrabajo, setTipoTrabajo] = useState<TipoTrabajo>("RENTA");
  const [ubicacion, setUbicacion] = useState("");
  const [valorEstimado, setValorEstimado] = useState("");
  const [asesorId, setAsesorId] = useState(asesores[0]?.id ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await crearLead({
        nombre,
        telefono: telefono || undefined,
        canal,
        tipoTrabajo,
        ubicacion: ubicacion || undefined,
        valorEstimado: valorEstimado ? Number(valorEstimado) : undefined,
        asesorId: asesorId || undefined,
      });
      setNombre("");
      setTelefono("");
      setUbicacion("");
      setValorEstimado("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo lead</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Nombre / empresa</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Constructora ABC"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Teléfono</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="55 0000 0000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Canal</label>
          <select
            value={canal}
            onChange={(e) => setCanal(e.target.value as CanalLead)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {CANALES.map((c) => (
              <option key={c} value={c}>
                {CANAL_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tipo de trabajo</label>
          <select
            value={tipoTrabajo}
            onChange={(e) => setTipoTrabajo(e.target.value as TipoTrabajo)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_TRABAJO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Ubicación (estado)</label>
          <input
            value={ubicacion}
            onChange={(e) => setUbicacion(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Jalisco"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Valor estimado (MXN)</label>
          <input
            type="number"
            min={0}
            value={valorEstimado}
            onChange={(e) => setValorEstimado(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="50000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Asignar a asesor</label>
          <select
            value={asesorId}
            onChange={(e) => setAsesorId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Sin asignar</option>
            {asesores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creando…" : "Crear lead"}
      </button>
    </form>
  );
}
