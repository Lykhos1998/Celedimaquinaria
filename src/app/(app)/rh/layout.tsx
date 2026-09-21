import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/rh", label: "Colaboradores" },
  { href: "/rh/permisos", label: "Permisos y Vacaciones" },
  { href: "/rh/nomina", label: "Nómina" },
];

export default async function RHLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("rh");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
