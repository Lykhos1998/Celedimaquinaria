import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/marketing", label: "Dashboard" },
  { href: "/marketing/leads", label: "Leads" },
  { href: "/marketing/gastos", label: "Gasto Publicitario" },
];

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("marketing");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
