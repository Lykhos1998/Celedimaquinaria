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
| Equipos / Flota | ✅ Construido (catálogo con estado/horómetro, tarifario, asignación de unidad al cerrar un contrato) |
| Taller | ✅ Construido (órdenes de servicio, historial por unidad, solicitud de refacciones) |
| Compras | ✅ Construido (proveedores, órdenes de compra, aprobación por Dirección, cierra el flujo con Taller) |
| Gerencia | ✅ Construido (KPIs globales + estado de módulos) |
| Área de Daños, Finanzas, Logística, RH, Sistemas/TI | 🕓 Definidos en la especificación, pendientes de construir |

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
prisma/schema.prisma        Modelo de datos (roles, Vigilancia, Comercial, Equipos/Flota, Taller, Compras)
prisma/seed.ts               Seed de usuarios demo
src/auth.ts                  Configuración de NextAuth (Credentials + JWT)
src/proxy.ts                  Protección de rutas por sesión (antes "middleware")
src/lib/roles.ts              Mapeo de módulos visibles por rol
src/lib/comercial.ts          Constantes y helpers del módulo Comercial (etapas, folios, estado de contrato)
src/lib/equipos.ts            Constantes y helpers del módulo Equipos/Flota (estados, folio)
src/lib/taller.ts             Constantes y helpers del módulo Taller (estados, folio de orden)
src/lib/compras.ts            Constantes y helpers del módulo Compras (estados, áreas, folio de OC)
src/app/(app)/layout.tsx      Shell con sidebar + header por rol
src/app/(app)/vigilancia/     Módulo Vigilancia
src/app/(app)/marketing/      Módulo Marketing (dashboard, leads, gasto publicitario)
src/app/(app)/ventas/         Módulo Ventas (pipeline kanban, mi cartera, contratos)
src/app/(app)/equipos/        Módulo Equipos/Flota (catálogo, tarifario)
src/app/(app)/taller/         Módulo Taller (órdenes de servicio, refacciones)
src/app/(app)/compras/        Módulo Compras (órdenes de compra, proveedores)
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

### Notas sobre el módulo Equipos / Flota

- El código de cada unidad (`EQ-XXXX`) es también el valor que codificaría su QR físico —
  no hay un campo de QR separado, ya que es el mismo identificador.
- El tarifario (`TarifaEquipo`) es independiente de las unidades físicas: varias unidades
  con la misma marca/modelo/clasificación comparten una tarifa, que Ventas usa para
  sugerir el valor mensual al cerrar un contrato.
- El estado de una unidad (Disponible / Rentado / En Tránsito / En Mantenimiento / Fuera de
  Servicio) es un campo manual salvo dos transiciones ya automatizadas: **Rentado** al
  cerrar un contrato en Ventas asignándole una unidad, y **En Mantenimiento** al abrir una
  orden de servicio en Taller (ver abajo). La transición a En Tránsito quedará automatizada
  cuando se construya Logística; mientras tanto se cambia a mano desde el catálogo.

### Notas sobre el módulo Taller

- Abrir una orden de servicio (`OrdenServicio`, folio `OS-XXXX`) pone automáticamente la
  unidad en **En Mantenimiento**; completarla o cancelarla la regresa a **Disponible**,
  pero solo si no quedan otras órdenes abiertas para esa misma unidad (`src/app/(app)/
  taller/actions.ts#actualizarEstadoOrden`) — así dos órdenes simultáneas sobre la misma
  máquina no se pisan entre sí.
- El "tiempo de reparación" se calcula como días entre `fechaInicio` y `fechaFin` (o "en
  curso" si la orden sigue abierta), no es un campo guardado aparte.
- El enlace "Ver historial" en el catálogo de Equipos/Flota filtra las órdenes de Taller por
  esa unidad (`/taller?equipoId=...`), implementando el "historial de mantenimiento por
  unidad ligado al catálogo" que pide la especificación.
- `SolicitudRefaccion` modela el lado de Taller del flujo ("Taller solicita"); el módulo
  Compras (ver abajo) agrega la cotización y la aprobación de Dirección.

### Notas sobre el módulo Compras

- Cierra el flujo descrito en la especificación (sección 3.5): Taller solicita una
  refacción → Compras la cotiza registrando proveedor y monto en una `OrdenCompra` (folio
  `OC-AAAA-XXXX`, estado inicial "Pendiente de aprobación") → **Dirección aprueba siempre,
  sin importar el monto** → Compras marca la orden como recibida, lo que también cierra
  automáticamente la `SolicitudRefaccion` de Taller que la originó
  (`src/app/(app)/compras/actions.ts#marcarOrdenRecibida`).
- "Dirección" se modela como el rol `GERENCIA`: aprobar/rechazar está restringido a ese rol
  dentro de la propia acción del servidor (`src/app/(app)/compras/actions.ts#direccion`),
  no solo oculto en la interfaz — un usuario de Compras no puede aprobar su propia cotización
  aunque intente llamar la acción directamente.
- También admite compras directas sin pasar por Taller (para RH, Sistemas/TI u "Otro"), ya
  que el detalle de esas compras seguía como punto abierto en la especificación; se captura
  con una descripción libre en lugar de una entidad dedicada, hasta que esos módulos existan
  y se defina su flujo real.

## Próximos pasos sugeridos

Según la sección 7 de la especificación:

1. Validar con Andrei los módulos marcados como pendientes en el documento, y el detalle de
   compras para RH/Sistemas-TI que sigue como punto abierto.
2. Logística es un buen candidato para el siguiente módulo: automatizaría la transición a
   En Tránsito, la última que sigue siendo manual en Equipos/Flota.
3. Definir identidad de marca (logo, colores) — actualmente se usa un color vino/maroon
   neutral de referencia.
4. Para producción: migrar `DATABASE_URL` a PostgreSQL y desplegar (Vercel, Docker, etc.).
