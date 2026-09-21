import { prisma } from "@/lib/prisma";
import { requireSesion } from "@/lib/access";
import { MiDispositivoCard } from "@/components/mi-cuenta/mi-dispositivo-card";
import { MisValesTable } from "@/components/mi-cuenta/mis-vales-table";

export default async function MiCuentaDispositivoPage() {
  const session = await requireSesion();

  const [dispositivos, vales] = await Promise.all([
    prisma.dispositivo.findMany({
      where: { colaboradorId: session.user.id, activo: true },
      orderBy: { codigo: "asc" },
    }),
    prisma.valeSalida.findMany({
      where: { solicitanteId: session.user.id, dispositivoId: { not: null } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const dispositivosConEstado = dispositivos.map((d) => ({
    ...d,
    tieneValeAbierto: vales.some(
      (v) => v.dispositivoId === d.id && !["RETORNADO", "VENCIDO"].includes(v.estado),
    ),
  }));

  return (
    <div className="flex flex-col gap-6">
      {dispositivos.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-5">
          <h3 className="mb-2 text-sm font-semibold text-foreground">Mi dispositivo</h3>
          <p className="text-sm text-muted">No tienes ningún equipo de cómputo asignado todavía.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {dispositivosConEstado.map((d) => (
            <MiDispositivoCard key={d.id} dispositivo={d} />
          ))}
        </div>
      )}

      <MisValesTable vales={vales} />
    </div>
  );
}
