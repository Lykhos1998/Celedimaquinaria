"use client";

import { useState, useTransition, type FormEvent } from "react";
import { registrarQR } from "@/app/(app)/vigilancia/actions";
import type { MovimientoQR } from "@prisma/client";

export function QRForm() {
  const [placa, setPlaca] = useState("");
  const [codigoQR, setCodigoQR] = useState("");
  const [destino, setDestino] = useState("");
  const [movimiento, setMovimiento] = useState<MovimientoQR>("SALIDA");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await registrarQR({ placa, codigoQR, movimiento, destino: destino || undefined });
      setPlaca("");
      setCodigoQR("");
      setDestino("");
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Escanear QR de camión
      </h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Placa / unidad</label>
          <input
            required
            value={placa}
            onChange={(e) => setPlaca(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="ABC-1234"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Código QR</label>
          <input
            required
            value={codigoQR}
            onChange={(e) => setCodigoQR(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Escaneo o folio"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Movimiento</label>
          <select
            value={movimiento}
            onChange={(e) => setMovimiento(e.target.value as MovimientoQR)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            <option value="SALIDA">Salida</option>
            <option value="LLEGADA">Llegada</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Destino (opcional)</label>
          <input
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Obra / cliente"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Registrando…" : "Registrar movimiento"}
      </button>
    </form>
  );
}
