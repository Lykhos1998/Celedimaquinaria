"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { trialVencido, diasRestantes, formatTrialHasta } from "@/lib/trial";

export default function LoginPage() {
  const router = useRouter();
  const vencido = trialVencido();
  const dias = diasRestantes();
  const hasta = formatTrialHasta();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Resplandor de fondo: un par de manchas de color de marca, sin textura ni imágenes
          externas, para que la pantalla no se vea plana en un fondo sólido. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/25 blur-[100px]" />
        <div className="absolute bottom-[-15%] right-[-10%] h-[24rem] w-[24rem] rounded-full bg-brand/10 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- logo estático, no necesita el pipeline de optimización de next/image */}
            <img
              src="/brand/celedi-logo.png"
              alt="Celedi Maquinaria"
              className="mx-auto mb-3 h-auto w-48"
            />
            <h1 className="sr-only">Celedi Maquinaria</h1>
            <p className="text-sm text-muted">Sistema integral por roles</p>
          </div>

          {vencido ? (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-center">
              <p className="text-sm font-medium text-foreground">El periodo de prueba terminó.</p>
              <p className="mt-1 text-sm text-muted">
                Contacta a Lykhos para activar el sistema y seguir usándolo.
              </p>
            </div>
          ) : (
            <>
              {hasta && (
                <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-center text-xs text-amber-500">
                  Versión de prueba — válida hasta el {hasta}
                  {dias !== null && ` (${dias} ${dias === 1 ? "día" : "días"})`}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">
                    Correo
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                    placeholder="tu.correo@celedimaquinaria.com"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="mb-1 block text-sm font-medium text-foreground">
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-border bg-surface-muted px-3 py-2 text-sm text-foreground outline-none focus:border-brand"
                    placeholder="••••••••"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-brand-foreground shadow-md shadow-brand/30 transition hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? "Entrando…" : "Entrar"}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo estático chico, no necesita el pipeline de optimización de next/image */}
          <img src="/brand/lykhos-logo.png" alt="" className="h-4 w-4 opacity-70" />
          Desarrollado por <span className="font-semibold text-foreground">Lykhos</span>
        </div>
      </div>
    </div>
  );
}
