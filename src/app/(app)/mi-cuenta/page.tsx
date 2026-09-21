import { prisma } from "@/lib/prisma";
import { requireSesion } from "@/lib/access";
import { MiTicketForm } from "@/components/mi-cuenta/mi-ticket-form";
import { MisTicketsTable } from "@/components/mi-cuenta/mis-tickets-table";

export default async function MiCuentaTicketsPage() {
  const session = await requireSesion();

  const tickets = await prisma.ticketSoporte.findMany({
    where: { reportadoPorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <MiTicketForm />
      <MisTicketsTable tickets={tickets} />
    </div>
  );
}
