import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/sistemas-ti", label: "Tickets de Soporte" },
  { href: "/sistemas-ti/dispositivos", label: "Mis Dispositivos" },
  { href: "/sistemas-ti/vales", label: "Vales de Salida" },
];

export default async function SistemasTILayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("sistemas-ti");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
