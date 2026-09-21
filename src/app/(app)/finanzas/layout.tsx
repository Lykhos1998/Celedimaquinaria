import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/finanzas", label: "Cuentas por Cobrar" },
  { href: "/finanzas/por-pagar", label: "Cuentas por Pagar" },
];

export default async function FinanzasLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("finanzas");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
