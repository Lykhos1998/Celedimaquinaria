import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/ventas", label: "Pipeline" },
  { href: "/ventas/mi-cartera", label: "Mi Cartera" },
  { href: "/ventas/contratos", label: "Contratos" },
];

export default async function VentasLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("ventas");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
