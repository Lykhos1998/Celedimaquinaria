import { prisma } from "@/lib/prisma";
import { QRForm } from "@/components/vigilancia/qr-form";
import { formatFechaHora } from "@/lib/format";

export default async function QRCamionesPage() {
  const movimientos = await prisma.qRVehiculo.findMany({
    include: { registradoPor: true },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  return (
    <div className="flex flex-col gap-6">
      <QRForm />

      <div className="rounded-xl border border-border bg-surface">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Movimientos recientes</h3>
        </div>
        {movimientos.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted">
            Sin movimientos de camiones registrados.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th className="px-5 py-2 font-medium">Placa</th>
                <th className="px-5 py-2 font-medium">Código QR</th>
                <th className="px-5 py-2 font-medium">Movimiento</th>
                <th className="px-5 py-2 font-medium">Destino</th>
                <th className="px-5 py-2 font-medium">Registrado por</th>
                <th className="px-5 py-2 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id} className="border-t border-border">
                  <td className="px-5 py-2 text-foreground">{m.placa}</td>
                  <td className="px-5 py-2 text-muted">{m.codigoQR}</td>
                  <td className="px-5 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        m.movimiento === "SALIDA"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-emerald-500/15 text-emerald-500"
                      }`}
                    >
                      {m.movimiento === "SALIDA" ? "Salida" : "Llegada"}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted">{m.destino ?? "—"}</td>
                  <td className="px-5 py-2 text-muted">{m.registradoPor.nombre}</td>
                  <td className="px-5 py-2 text-muted">{formatFechaHora(m.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
