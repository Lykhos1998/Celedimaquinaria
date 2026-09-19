import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/compras", label: "Órdenes de Compra" },
  { href: "/compras/proveedores", label: "Proveedores" },
];

export default async function ComprasLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("compras");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
