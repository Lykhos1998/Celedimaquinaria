"use client";

import { useState, useTransition } from "react";
import { reasignarDispositivo } from "@/app/(app)/sistemas-ti/actions";
import { TIPO_DISPOSITIVO_LABEL } from "@/lib/sistemas-ti";
import { formatFechaHora } from "@/lib/format";
import type { TipoDispositivo } from "@prisma/client";

export type DispositivoRow = {
  id: string;
  codigo: string;
  tipo: TipoDispositivo;
  marca: string;
  modelo: string;
  numeroSerie: string | null;
  fechaAsignacion: Date | null;
  colaborador: { id: string; nombre: string } | null;
};

export type ColaboradorOption = { id: string; nombre: string };

function FilaDispositivo({ d, colaboradores }: { d: DispositivoRow; colaboradores: ColaboradorOption[] }) {
  const [colaboradorId, setColaboradorId] = useState(d.colaborador?.id ?? "");
  const [pending, startTransition] = useTransition();

  function handleChange(value: string) {
    setColaboradorId(value);
    startTransition(() => reasignarDispositivo(d.id, value || null));
  }

  return (
    <tr className="border-t border-border">
      <td className="px-5 py-2 font-mono text-xs text-foreground">{d.codigo}</td>
      <td className="px-5 py-2 text-muted">{TIPO_DISPOSITIVO_LABEL[d.tipo]}</td>
      <td className="px-5 py-2 text-foreground">
        {d.marca} {d.modelo}
        {d.numeroSerie && <p className="text-xs text-muted">S/N {d.numeroSerie}</p>}
      </td>
      <td className="px-5 py-2">
        <select
          value={colaboradorId}
          disabled={pending}
          onChange={(e) => handleChange(e.target.value)}
          className="w-full rounded-md border border-border bg-surface-muted px-2 py-1 text-xs text-foreground outline-none focus:border-brand disabled:opacity-60"
        >
          <option value="">Sin asignar</option>
          {colaboradores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </td>
      <td className="px-5 py-2 text-muted">{d.fechaAsignacion ? formatFechaHora(d.fechaAsignacion) : "—"}</td>
    </tr>
  );
}

export function DispositivosTable({
  dispositivos,
  colaboradores,
}: {
  dispositivos: DispositivoRow[];
  colaboradores: ColaboradorOption[];
}) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Catálogo de dispositivos</h3>
      </div>
      {dispositivos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin dispositivos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Código</th>
                <th className="px-5 py-2 font-medium">Tipo</th>
                <th className="px-5 py-2 font-medium">Equipo</th>
                <th className="px-5 py-2 font-medium">Asignado a</th>
                <th className="px-5 py-2 font-medium">Desde</th>
              </tr>
            </thead>
            <tbody>
              {dispositivos.map((d) => (
                <FilaDispositivo key={d.id} d={d} colaboradores={colaboradores} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
