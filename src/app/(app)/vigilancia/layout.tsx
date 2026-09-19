import { requireAcceso } from "@/lib/access";
import { VigilanciaTabs } from "@/components/vigilancia-tabs";

export default async function VigilanciaLayout({ children }: { children: React.ReactNode }) {
  await requireAcceso("vigilancia");

  return (
    <div className="flex h-full flex-col gap-4">
      <VigilanciaTabs />
      <div className="flex-1">{children}</div>
    </div>
  );
}
