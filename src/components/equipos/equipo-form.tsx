"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearEquipo } from "@/app/(app)/equipos/actions";
import { COMBUSTIBLE_LABEL } from "@/lib/equipos";
import type { Combustible } from "@prisma/client";

const COMBUSTIBLES = Object.keys(COMBUSTIBLE_LABEL) as Combustible[];

export type TarifaOption = { id: string; marca: string; modelo: string; clasificacion: string };

export function EquipoForm({ tarifas }: { tarifas: TarifaOption[] }) {
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anio, setAnio] = useState(String(new Date().getFullYear()));
  const [numeroSerie, setNumeroSerie] = useState("");
  const [categoria, setCategoria] = useState("");
  const [combustible, setCombustible] = useState<Combustible>("DIESEL");
  const [altura, setAltura] = useState("");
  const [tarifaId, setTarifaId] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!marca.trim() || !modelo.trim() || !categoria.trim()) return;
    startTransition(async () => {
      await crearEquipo({
        marca,
        modelo,
        anio: Number(anio),
        numeroSerie: numeroSerie || undefined,
        categoria,
        combustible,
        altura: altura ? Number(altura) : undefined,
        tarifaId: tarifaId || undefined,
      });
      setMarca("");
      setModelo("");
      setNumeroSerie("");
      setCategoria("");
      setAltura("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nueva unidad</h3>
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
          <label className="mb-1 block text-xs font-medium text-muted">Año</label>
          <input
            required
            type="number"
            min={1980}
            max={2100}
            value={anio}
            onChange={(e) => setAnio(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Número de serie</label>
          <input
            value={numeroSerie}
            onChange={(e) => setNumeroSerie(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="SN-00123"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Categoría</label>
          <input
            required
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            list="categorias-equipo"
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Excavadora"
          />
          <datalist id="categorias-equipo">
            <option value="Excavadora" />
            <option value="Montacargas" />
            <option value="Grúa" />
            <option value="Rodillo" />
            <option value="Compactadora" />
            <option value="Retroexcavadora" />
            <option value="Plataforma elevadora" />
          </datalist>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Combustible</label>
          <select
            value={combustible}
            onChange={(e) => setCombustible(e.target.value as Combustible)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {COMBUSTIBLES.map((c) => (
              <option key={c} value={c}>
                {COMBUSTIBLE_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Altura / capacidad (m)</label>
          <input
            type="number"
            min={0}
            step="0.1"
            value={altura}
            onChange={(e) => setAltura(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="10"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Tarifa</label>
          <select
            value={tarifaId}
            onChange={(e) => setTarifaId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="">Sin tarifa asignada</option>
            {tarifas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.marca} {t.modelo} — {t.clasificacion}
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
        {pending ? "Creando…" : "Registrar unidad"}
      </button>
    </form>
  );
}
