"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearValeDispositivo } from "@/app/(app)/sistemas-ti/actions";

export type DispositivoOption = {
  id: string;
  codigo: string;
  marca: string;
  modelo: string;
  colaboradorId: string;
  colaboradorNombre: string;
};

export function ValeDispositivoForm({ dispositivos }: { dispositivos: DispositivoOption[] }) {
  const [dispositivoId, setDispositivoId] = useState(dispositivos[0]?.id ?? "");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const dispositivo = dispositivos.find((d) => d.id === dispositivoId);
    if (!dispositivo) return;
    startTransition(async () => {
      await crearValeDispositivo(dispositivo.id, dispositivo.colaboradorId);
    });
  }

  if (dispositivos.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-surface p-5">
        <h3 className="mb-2 text-sm font-semibold text-foreground">Solicitar salida de equipo</h3>
        <p className="text-sm text-muted">
          Asigna un dispositivo a un colaborador en &ldquo;Mis Dispositivos&rdquo; antes de solicitar su salida.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Solicitar salida de equipo</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Dispositivo asignado</label>
          <select
            value={dispositivoId}
            onChange={(e) => setDispositivoId(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {dispositivos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.codigo} — {d.marca} {d.modelo} ({d.colaboradorNombre})
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
        {pending ? "Registrando…" : "Registrar solicitud de salida"}
      </button>
    </form>
  );
}
