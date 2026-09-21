"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearMiTicket } from "@/app/(app)/mi-cuenta/actions";
import { CATEGORIA_TICKET_LABEL, PRIORIDAD_TICKET_LABEL } from "@/lib/sistemas-ti";
import type { CategoriaTicket, PrioridadTicket } from "@prisma/client";

const CATEGORIAS = Object.keys(CATEGORIA_TICKET_LABEL) as CategoriaTicket[];
const PRIORIDADES = Object.keys(PRIORIDAD_TICKET_LABEL) as PrioridadTicket[];

export function MiTicketForm() {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState<CategoriaTicket>("HARDWARE");
  const [prioridad, setPrioridad] = useState<PrioridadTicket>("MEDIA");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!titulo.trim()) return;
    startTransition(async () => {
      await crearMiTicket({ titulo, categoria, prioridad });
      setTitulo("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Reportar un problema</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-medium text-muted">Título</label>
          <input
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="No enciende el monitor"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaTicket)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {CATEGORIA_TICKET_LABEL[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Prioridad</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value as PrioridadTicket)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {PRIORIDADES.map((p) => (
              <option key={p} value={p}>
                {PRIORIDAD_TICKET_LABEL[p]}
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
        {pending ? "Enviando…" : "Reportar a Sistemas/TI"}
      </button>
    </form>
  );
}
