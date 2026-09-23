import { prisma } from "@/lib/prisma";
import { ChecadorForm } from "@/components/vigilancia/checador-form";
import { formatHora } from "@/lib/format";

const TIPO_LABEL: Record<string, string> = {
  ENTRADA: "Entrada",
  SALIDA: "Salida",
  ENTRADA_COMIDA: "Entrada de comida",
  SALIDA_COMIDA: "Salida a comida",
};

export default async function ChecadorPage() {
  const inicioDelDia = new Date();
  inicioDelDia.setHours(0, 0, 0, 0);

  const [colaboradores, registros] = await Promise.all([
    prisma.user.findMany({
      // Gerencia no checa entrada/salida como el resto del personal.
      where: { activo: true, rol: { not: "GERENCIA" } },
      select: { id: true, nombre: true },
      orderBy: { nombre: "asc" },
    }),
    prisma.asistenciaRegistro.findMany({
      where: { timestamp: { gte: inicioDelDia } },
      include: { colaborador: true },
      orderBy: { timestamp: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <ChecadorForm colaboradores={colaboradores} />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Registros de hoy</h3>
        </div>
        {registros.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Aún no hay checadas registradas hoy.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Colaborador</th>
                <th className="px-5 py-2 font-medium">Movimiento</th>
                <th className="px-5 py-2 font-medium">Hora</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-5 py-2 text-foreground">{r.colaborador.nombre}</td>
                  <td className="px-5 py-2 text-muted">{TIPO_LABEL[r.tipo]}</td>
                  <td className="px-5 py-2 text-muted">{formatHora(r.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
