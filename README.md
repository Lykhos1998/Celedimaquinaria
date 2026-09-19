# Celedi Maquinaria — Sistema Integral

Sistema multiusuario por roles para Celedi Maquinaria (renta de maquinaria), construido a
partir de la especificación funcional en [`docs/especificacion-funcional.pdf`](docs/especificacion-funcional.pdf).

Cada colaborador entra con su cuenta y ve únicamente el módulo de su área; Gerencia tiene
una vista global que cruza la información de todas las áreas. El sistema soporta modo
oscuro y modo claro (toggle en el header).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma ORM](https://www.prisma.io) — SQLite en desarrollo (cambiar `provider` en
  `prisma/schema.prisma` a `postgresql` para producción)
- [NextAuth v5](https://authjs.dev) (Credentials) para autenticación y sesiones por rol

## Estado de los módulos

| Módulo | Estado |
| --- | --- |
| Vigilancia | ✅ Construido (checador, QR de camiones, vales de salida, bitácora de incidentes) |
| Marketing | ✅ Construido (dashboard con KPIs/funnel/pronóstico, captura de leads, gasto publicitario) |
| Ventas | ✅ Construido (pipeline kanban, cierre de contratos, mi cartera, listado de contratos) |
| Gerencia | ✅ Construido (KPIs globales + estado de módulos) |
| Área de Daños, Taller, Finanzas, Logística, RH, Equipos/Flota, Sistemas/TI | 🕓 Definidos en la especificación, pendientes de construir |
| Compras | 🕓 Parcialmente definido (falta cerrar detalle de compras para RH/TI) |

## Arranque local

```bash
npm install
cp .env.example .env        # genera un AUTH_SECRET propio: openssl rand -base64 32
npx prisma migrate dev      # crea la base SQLite y aplica el esquema
npm run db:seed             # crea usuarios demo, uno por rol
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Usuarios demo

Contraseña para todos: `celedi2026`

| Rol | Correo |
| --- | --- |
| Gerencia | gerencia@celedimaquinaria.com |
| Vigilante | vigilancia@celedimaquinaria.com |
| Marketing | marketing@celedimaquinaria.com |
| Asesor de Ventas | ventas@celedimaquinaria.com |
| Inspector de Daños | danos@celedimaquinaria.com |
| Compras | compras@celedimaquinaria.com |
| Taller | taller@celedimaquinaria.com |
| Finanzas | finanzas@celedimaquinaria.com |
| Logística | logistica@celedimaquinaria.com |
| RH | rh@celedimaquinaria.com |
| Sistemas / TI | ti@celedimaquinaria.com |

## Estructura

```
prisma/schema.prisma        Modelo de datos (roles, Vigilancia, Comercial)
prisma/seed.ts               Seed de usuarios demo
src/auth.ts                  Configuración de NextAuth (Credentials + JWT)
src/proxy.ts                  Protección de rutas por sesión (antes "middleware")
src/lib/roles.ts              Mapeo de módulos visibles por rol
src/lib/comercial.ts          Constantes y helpers del módulo Comercial (etapas, folios, estado de contrato)
src/app/(app)/layout.tsx      Shell con sidebar + header por rol
src/app/(app)/vigilancia/     Módulo Vigilancia
src/app/(app)/marketing/      Módulo Marketing (dashboard, leads, gasto publicitario)
src/app/(app)/ventas/         Módulo Ventas (pipeline kanban, mi cartera, contratos)
src/app/(app)/gerencia/       Vista global de Gerencia
src/app/(app)/[modulo]/       Placeholder "próximamente" para módulos aún no construidos
docs/especificacion-funcional.pdf   Documento fuente de la especificación
```

### Notas sobre el módulo Comercial

- El folio de lead (`EXP-XXXX`) se genera al capturarlo en Marketing; el folio de contrato
  (`CTR-AAAA-XXXX`) se genera al marcarlo como Ganado en Ventas.
- El estado del contrato (En Firma / Activo / Por Vencer / Terminado) se calcula en cada
  lectura a partir de sus fechas (`src/lib/comercial.ts#estadoContrato`), no se guarda como
  campo manual — así no depende de un job programado.
- El "Pronóstico de cierre" del dashboard de Marketing usa una probabilidad fija por etapa
  del pipeline (heurística simple, documentada en la propia página), no un modelo estadístico.
- La comisión del asesor es una tasa fija de ejemplo (5% del valor mensual del contrato) —
  ajustar en `src/lib/comercial.ts#comisionEstimada` cuando se defina la regla real.

## Próximos pasos sugeridos

Según la sección 7 de la especificación:

1. Validar con Andrei los módulos marcados como pendientes en el documento.
2. Cerrar el flujo de aprobación Compras–Taller (y compras para RH/Sistemas-TI).
3. Priorizar el siguiente módulo a construir (Equipos/Flota es un buen candidato: alimenta
   el tarifario que Ventas necesita para cotizar con precisión).
4. Definir identidad de marca (logo, colores) — actualmente se usa un color vino/maroon
   neutral de referencia.
5. Para producción: migrar `DATABASE_URL` a PostgreSQL y desplegar (Vercel, Docker, etc.).
