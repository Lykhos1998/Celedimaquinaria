import { requireAcceso } from "@/lib/access";
import { ModuleTabs } from "@/components/module-tabs";

const TABS = [
  { href: "/vigilancia", label: "Checador" },
  { href: "/vigilancia/qr", label: "QR Camiones" },
  { href: "/vigilancia/vales", label: "Vales de Salida" },
  { href: "/vigilancia/incidentes", label: "Bitácora de Incidentes" },
];

export default async function VigilanciaLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("vigilancia");

  return (
    <div className="flex h-full flex-col gap-4">
      <ModuleTabs tabs={TABS} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
