"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/vigilancia", label: "Checador" },
  { href: "/vigilancia/qr", label: "QR Camiones" },
  { href: "/vigilancia/vales", label: "Vales de Salida" },
  { href: "/vigilancia/incidentes", label: "Bitácora de Incidentes" },
];

export function VigilanciaTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              active
                ? "border-brand text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
