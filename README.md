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
| Gerencia | ✅ Construido (KPIs globales + estado de módulos) |
| Marketing, Ventas, Área de Daños, Taller, Finanzas, Logística, RH, Equipos/Flota, Sistemas/TI | 🕓 Definidos en la especificación, pendientes de construir |
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
prisma/schema.prisma        Modelo de datos (roles + entidades de Vigilancia)
prisma/seed.ts               Seed de usuarios demo
src/auth.ts                  Configuración de NextAuth (Credentials + JWT)
src/middleware.ts             Protección de rutas por sesión
src/lib/roles.ts              Mapeo de módulos visibles por rol
src/app/(app)/layout.tsx      Shell con sidebar + header por rol
src/app/(app)/vigilancia/     Módulo Vigilancia (único módulo funcional por ahora)
src/app/(app)/gerencia/       Vista global de Gerencia
src/app/(app)/[modulo]/       Placeholder "próximamente" para módulos aún no construidos
docs/especificacion-funcional.pdf   Documento fuente de la especificación
```

## Próximos pasos sugeridos

Según la sección 7 de la especificación:

1. Validar con Andrei los módulos marcados como pendientes en el documento.
2. Cerrar el flujo de aprobación Compras–Taller (y compras para RH/Sistemas-TI).
3. Priorizar el siguiente módulo a construir (Comercial: Marketing + Ventas + Equipos/Flota
   es el núcleo del negocio y tiene la referencia visual más detallada).
4. Definir identidad de marca (logo, colores) — actualmente se usa un color vino/maroon
   neutral de referencia.
5. Para producción: migrar `DATABASE_URL` a PostgreSQL y desplegar (Vercel, Docker, etc.).
