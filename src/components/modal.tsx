"use client";

import type { ReactNode } from "react";

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="text-muted transition hover:text-foreground"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
