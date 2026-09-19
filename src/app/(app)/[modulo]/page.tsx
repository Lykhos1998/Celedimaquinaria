import { notFound } from "next/navigation";
import { Construction } from "lucide-react";
import { MODULOS, type ModuloSlug } from "@/lib/roles";
import { requireAcceso } from "@/lib/access";

export default async function ModuloPlaceholderPage({
  params,
}: {
  params: Promise<{ modulo: string }>;
}) {
  const { modulo } = await params;

  if (!(modulo in MODULOS)) notFound();
  const slug = modulo as ModuloSlug;

  // El módulo Vigilancia y Gerencia tienen sus propias rutas con
  // implementación real; si llegamos aquí es porque siguen pendientes.
  if (MODULOS[slug].implementado) notFound();

  await requireAcceso(slug);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-24 text-center">
      <Construction className="text-muted" size={32} />
      <h2 className="text-lg font-semibold text-foreground">
        {MODULOS[slug].label} — próximamente
      </h2>
      <p className="max-w-sm text-sm text-muted">
        Este módulo está definido en la especificación funcional pero aún no
        se ha construido. Vigilancia es el primer módulo implementado.
      </p>
    </div>
  );
}
