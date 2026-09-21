import { requireSesion } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/mi-cuenta", label: "Mis Tickets" },
  { href: "/mi-cuenta/permisos", label: "Mis Permisos" },
  { href: "/mi-cuenta/dispositivo", label: "Mi Dispositivo" },
];

export default async function MiCuentaLayout({ children }: { children: React.ReactNode }) {
  await requireSesion();

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
