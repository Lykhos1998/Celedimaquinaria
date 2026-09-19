import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/logistica", label: "Traslados" },
  { href: "/logistica/flotilla", label: "Flotilla" },
];

export default async function LogisticaLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("logistica");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
