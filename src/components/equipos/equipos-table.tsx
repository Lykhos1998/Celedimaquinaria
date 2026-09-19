"use client";

import { useTransition } from "react";
import { cambiarEstadoEquipo } from "@/app/(app)/equipos/actions";
import { COMBUSTIBLE_LABEL, ESTADO_EQUIPO_LABEL, ESTADO_EQUIPO_STYLE } from "@/lib/equipos";
import type { Combustible, EstadoEquipo } from "@prisma/client";

const ESTADOS = Object.keys(ESTADO_EQUIPO_LABEL) as EstadoEquipo[];

export type EquipoRow = {
  id: string;
  codigo: string;
  marca: string;
  modelo: string;
  anio: number;
  numeroSerie: string | null;
  categoria: string;
  combustible: Combustible;
  altura: number | null;
  horometro: number;
  estado: EstadoEquipo;
  tarifaLabel: string | null;
};

export function EquiposTable({ equipos }: { equipos: EquipoRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Catálogo de equipos</h3>
      </div>
      {equipos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin unidades que coincidan con el filtro.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Código</th>
                <th className="px-5 py-2 font-medium">Marca / Modelo</th>
                <th className="px-5 py-2 font-medium">Año</th>
                <th className="px-5 py-2 font-medium">Serie</th>
                <th className="px-5 py-2 font-medium">Categoría</th>
                <th className="px-5 py-2 font-medium">Combustible</th>
                <th className="px-5 py-2 font-medium">Horómetro</th>
                <th className="px-5 py-2 font-medium">Tarifa</th>
                <th className="px-5 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {equipos.map((e) => (
                <tr key={e.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{e.codigo}</td>
                  <td className="px-5 py-2 text-foreground">
                    {e.marca} {e.modelo}
                  </td>
                  <td className="px-5 py-2 text-muted">{e.anio}</td>
                  <td className="px-5 py-2 text-muted">{e.numeroSerie ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{e.categoria}</td>
                  <td className="px-5 py-2 text-muted">{COMBUSTIBLE_LABEL[e.combustible]}</td>
                  <td className="px-5 py-2 text-muted">{e.horometro.toLocaleString("es-MX")} h</td>
                  <td className="px-5 py-2 text-muted">{e.tarifaLabel ?? "—"}</td>
                  <td className="px-5 py-2">
                    <select
                      disabled={pending}
                      value={e.estado}
                      onChange={(ev) =>
                        startTransition(() => cambiarEstadoEquipo(e.id, ev.target.value as EstadoEquipo))
                      }
                      className={`rounded-full border-0 px-2 py-1 text-xs font-medium outline-none ${ESTADO_EQUIPO_STYLE[e.estado]}`}
                    >
                      {ESTADOS.map((estado) => (
                        <option key={estado} value={estado} className="bg-surface text-foreground">
                          {ESTADO_EQUIPO_LABEL[estado]}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
