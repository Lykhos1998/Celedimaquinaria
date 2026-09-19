import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/taller", label: "Órdenes de Servicio" },
  { href: "/taller/refacciones", label: "Refacciones" },
];

export default async function TallerLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("taller");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
