"use client";

import { useTransition } from "react";
import { marcarCuentaCobrada } from "@/app/(app)/finanzas/actions";
import { CONCEPTO_COBRO_LABEL, ESTADO_CXC_LABEL, ESTADO_CXC_STYLE, estadoCuentaCobrar } from "@/lib/finanzas";
import { formatFechaHora } from "@/lib/format";
import type { ConceptoCobro } from "@prisma/client";

export type CuentaCobrarRow = {
  id: string;
  folio: string;
  concepto: ConceptoCobro;
  descripcion: string;
  monto: number;
  cobrada: boolean;
  fechaVencimiento: Date;
  fechaCobro: Date | null;
  registradoPor: { nombre: string };
  cobradoPor: { nombre: string } | null;
};

export function CuentasCobrarTable({ cuentas }: { cuentas: CuentaCobrarRow[] }) {
  const [pending, startTransition] = useTransition();

  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Cuentas por cobrar</h3>
      </div>
      {cuentas.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin cuentas por cobrar registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Concepto</th>
                <th className="px-5 py-2 font-medium">Descripción</th>
                <th className="px-5 py-2 font-medium">Monto</th>
                <th className="px-5 py-2 font-medium">Vence</th>
                <th className="px-5 py-2 font-medium">Estado</th>
                <th className="px-5 py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {cuentas.map((c) => {
                const estado = estadoCuentaCobrar(c);
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="px-5 py-2 font-mono text-xs text-foreground">{c.folio}</td>
                    <td className="px-5 py-2 text-muted">{CONCEPTO_COBRO_LABEL[c.concepto]}</td>
                    <td className="px-5 py-2 text-foreground">{c.descripcion}</td>
                    <td className="px-5 py-2 text-muted">${c.monto.toLocaleString("es-MX")}</td>
                    <td className="px-5 py-2 text-muted">{formatFechaHora(c.fechaVencimiento)}</td>
                    <td className="px-5 py-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_CXC_STYLE[estado]}`}>
                        {ESTADO_CXC_LABEL[estado]}
                      </span>
                      {c.cobradoPor && (
                        <p className="mt-0.5 text-[10px] text-muted">
                          {c.cobradoPor.nombre} · {c.fechaCobro && formatFechaHora(c.fechaCobro)}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-2 text-right">
                      {!c.cobrada && (
                        <button
                          disabled={pending}
                          onClick={() => startTransition(() => marcarCuentaCobrada(c.id))}
                          className="rounded-md border border-border px-3 py-1 text-xs font-medium text-emerald-500 transition hover:border-emerald-500 disabled:opacity-50"
                        >
                          Marcar cobrada
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
