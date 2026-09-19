import { SEVERIDAD_DANIO_LABEL, SEVERIDAD_DANIO_STYLE } from "@/lib/danos";
import { formatFechaHora } from "@/lib/format";
import type { SeveridadDanio } from "@prisma/client";

export type DanioRow = {
  id: string;
  tipo: string;
  severidad: SeveridadDanio;
  descripcion: string | null;
  fotoUrl: string | null;
  costoEstimado: number | null;
  createdAt: Date;
  reporte: { folio: string };
  registradoPor: { nombre: string };
};

export function DaniosTable({ danos }: { danos: DanioRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Daños registrados</h3>
      </div>
      {danos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">Sin daños registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Reporte</th>
                <th className="px-5 py-2 font-medium">Evidencia</th>
                <th className="px-5 py-2 font-medium">Tipo</th>
                <th className="px-5 py-2 font-medium">Descripción</th>
                <th className="px-5 py-2 font-medium">Severidad</th>
                <th className="px-5 py-2 font-medium">Costo estimado</th>
                <th className="px-5 py-2 font-medium">Registrado por</th>
                <th className="px-5 py-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {danos.map((d) => (
                <tr key={d.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{d.reporte.folio}</td>
                  <td className="px-5 py-2">
                    {d.fotoUrl ? (
                      <a href={d.fotoUrl} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element -- evidencia subida por el usuario, servida desde /public/uploads */}
                        <img
                          src={d.fotoUrl}
                          alt={`Evidencia de ${d.tipo}`}
                          className="h-10 w-10 rounded object-cover"
                        />
                      </a>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-5 py-2 text-foreground">{d.tipo}</td>
                  <td className="px-5 py-2 text-muted">{d.descripcion ?? "—"}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERIDAD_DANIO_STYLE[d.severidad]}`}>
                      {SEVERIDAD_DANIO_LABEL[d.severidad]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">
                    {d.costoEstimado ? `$${d.costoEstimado.toLocaleString("es-MX")}` : "—"}
                  </td>
                  <td className="px-5 py-2 text-muted">{d.registradoPor.nombre}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(d.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
