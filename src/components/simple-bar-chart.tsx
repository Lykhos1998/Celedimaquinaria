export function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div className="flex h-32 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-t bg-brand/70"
            style={{ height: `${Math.max(2, (d.value / max) * 100)}%` }}
            title={`${d.label}: ${d.value}`}
          />
          <span className="text-[10px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
