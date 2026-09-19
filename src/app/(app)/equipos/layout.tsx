import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/equipos", label: "Catálogo" },
  { href: "/equipos/tarifario", label: "Tarifario" },
];

export default async function EquiposLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("equipos");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
