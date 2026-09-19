"use client";

import { useState, useTransition, type FormEvent } from "react";
import { crearProveedor } from "@/app/(app)/compras/actions";

export function ProveedorForm() {
  const [nombre, setNombre] = useState("");
  const [contacto, setContacto] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [categoria, setCategoria] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) return;
    startTransition(async () => {
      await crearProveedor({
        nombre,
        contacto: contacto || undefined,
        telefono: telefono || undefined,
        email: email || undefined,
        categoria: categoria || undefined,
      });
      setNombre("");
      setContacto("");
      setTelefono("");
      setEmail("");
      setCategoria("");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Nuevo proveedor</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Nombre</label>
          <input
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Refaccionaria del Norte"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Contacto</label>
          <input
            value={contacto}
            onChange={(e) => setContacto(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Juan Pérez"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Teléfono</label>
          <input
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="81 0000 0000"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Correo</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="ventas@proveedor.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-muted">Categoría</label>
          <input
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
            placeholder="Refacciones"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Guardando…" : "Registrar proveedor"}
      </button>
    </form>
  );
}
