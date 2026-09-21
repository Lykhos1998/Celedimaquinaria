"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearColaborador } from "@/app/(app)/rh/actions";
import { ROL_LABEL } from "@/lib/roles";
import type { Rol } from "@prisma/client";

const ROLES = Object.keys(ROL_LABEL) as Rol[];

export function ColaboradorForm() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("VIGILANTE");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim() || !password.trim()) return;
    startTransition(async () => {
      await crearColaborador({ nombre, email, password, rol });
      setNombre("");
      setEmail("");
      setPassword("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Alta de colaborador</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Nombre</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Nombre completo"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Correo</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="nombre@celedimaquinaria.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Rol</label>
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value as Rol)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROL_LABEL[r]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Contraseña inicial</label>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Creando…" : "Dar de alta"}
      </button>
    </form>
  );
}
