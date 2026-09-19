import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/danos", label: "Inspecciones" },
  { href: "/danos/hallazgos", label: "Daños" },
];

export default async function DanosLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("danos");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
