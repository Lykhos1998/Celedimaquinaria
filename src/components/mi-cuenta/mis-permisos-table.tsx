import { TIPO_PERMISO_LABEL, ESTADO_PERMISO_LABEL, ESTADO_PERMISO_STYLE } from "@/lib/rh";
import { formatFechaHora } from "@/lib/format";
import type { TipoPermiso, EstadoPermiso } from "@prisma/client";

export type MiPermisoRow = {
  id: string;
  folio: string;
  tipo: TipoPermiso;
  fechaInicio: Date;
  fechaFin: Date;
  motivo: string | null;
  estado: EstadoPermiso;
};

export function MisPermisosTable({ permisos }: { permisos: MiPermisoRow[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface">
      <div className="border-b border-border px-5 py-3">
        <h3 className="text-sm font-semibold text-foreground">Mis solicitudes</h3>
      </div>
      {permisos.length === 0 ? (
        <p className="px-5 py-8 text-center text-sm text-muted">No has hecho ninguna solicitud.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Folio</th>
                <th className="px-5 py-2 font-medium">Tipo</th>
                <th className="px-5 py-2 font-medium">Desde</th>
                <th className="px-5 py-2 font-medium">Hasta</th>
                <th className="px-5 py-2 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono text-xs text-foreground">{p.folio}</td>
                  <td className="px-5 py-2 text-foreground">
                    {TIPO_PERMISO_LABEL[p.tipo]}
                    {p.motivo && <p className="text-xs text-muted">{p.motivo}</p>}
                  </td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(p.fechaInicio)}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(p.fechaFin)}</td>
                  <td className="px-5 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_PERMISO_STYLE[p.estado]}`}>
                      {ESTADO_PERMISO_LABEL[p.estado]}
                    </span>
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
