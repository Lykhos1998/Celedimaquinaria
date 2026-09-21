// Corte de periodo de prueba, controlado por una sola fecha límite en
// NEXT_PUBLIC_TRIAL_HASTA (env var, formato ISO). Sin esa variable, el
// límite queda desactivado por completo — así el desarrollo local y un
// despliegue "de verdad" (ya comprado) no dependen de recordarla.
//
// Para activar el sistema en definitivo tras la prueba: borra la variable
// en Vercel (o muévela a una fecha futura lejana) y vuelve a desplegar. No
// hace falta tocar código.
const TRIAL_HASTA_RAW = process.env.NEXT_PUBLIC_TRIAL_HASTA;

export const TRIAL_HASTA = TRIAL_HASTA_RAW ? new Date(TRIAL_HASTA_RAW) : null;

export function trialVencido(): boolean {
  if (!TRIAL_HASTA) return false;
  return new Date() > TRIAL_HASTA;
}

export function diasRestantes(): number | null {
  if (!TRIAL_HASTA) return null;
  const ms = TRIAL_HASTA.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export function formatTrialHasta(): string | null {
  if (!TRIAL_HASTA) return null;
  return new Intl.DateTimeFormat("es-MX", { day: "2-digit", month: "long", year: "numeric" }).format(TRIAL_HASTA);
}
