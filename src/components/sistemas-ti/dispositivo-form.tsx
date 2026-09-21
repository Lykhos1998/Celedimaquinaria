"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearDispositivo } from "@/app/(app)/sistemas-ti/actions";
import { TIPO_DISPOSITIVO_LABEL } from "@/lib/sistemas-ti";
import type { TipoDispositivo } from "@prisma/client";

const TIPOS = Object.keys(TIPO_DISPOSITIVO_LABEL) as TipoDispositivo[];

export type ColaboradorOption = { id: string; nombre: string };

export function DispositivoForm({ colaboradores }: { colaboradores: ColaboradorOption[] }) {
  const [tipo, setTipo] = useState<TipoDispositivo>("LAPTOP");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [numeroSerie, setNumeroSerie] = useState("");
  const [colaboradorId, setColaboradorId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!marca.trim() || !modelo.trim()) return;
    startTransition(async () => {
      await crearDispositivo({
        tipo,
        marca,
        modelo,
        numeroSerie: numeroSerie || undefined,
        colaboradorId: colaboradorId || undefined,
      });
      setMarca("");
      setModelo("");
      setNumeroSerie("");
      setColaboradorId("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Alta de dispositivo</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoDispositivo)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_DISPOSITIVO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Marca</label>
          <input
            required
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Dell"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Modelo</label>
          <input
            required
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Latitude 5420"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Número de serie</label>
          <input
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Opcional"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Asignar a</label>
          <select
            value={colaboradorId}
            onChange={(e) => setColaboradorId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Sin asignar</option>
            {colaboradores.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
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
        {pending ? "Guardando…" : "Dar de alta"}
      </button>
    </form>
  );
}
