# Celedi Maquinaria — Sistema Integral

Sistema multiusuario por roles para Celedi Maquinaria (renta de maquinaria), construido a
partir de la especificación funcional en [`docs/especificacion-funcional.pdf`](docs/especificacion-funcional.pdf).

Cada colaborador entra con su cuenta y ve únicamente el módulo de su área; Gerencia tiene
una vista global que cruza la información de todas las áreas. El sistema soporta modo
oscuro y modo claro (toggle en el header).

## Stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript + Tailwind CSS
- [Prisma ORM](https://www.prisma.io) sobre PostgreSQL
- [NextAuth v5](https://authjs.dev) (Credentials) para autenticación y sesiones por rol
- [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) para la evidencia fotográfica
  de Área de Daños (con fallback a disco local si no está configurado, ver abajo)

## Estado de los módulos

| Módulo | Estado |
| --- | --- |
| Vigilancia | ✅ Construido (checador, QR de camiones, vales de salida, bitácora de incidentes) |
| Marketing | ✅ Construido (dashboard con KPIs/funnel/pronóstico, captura de leads, gasto publicitario) |
| Ventas | ✅ Construido (pipeline kanban, cierre de contratos, mi cartera, listado de contratos) |
| Equipos / Flota | ✅ Construido (catálogo con estado/horómetro, tarifario, asignación de unidad al cerrar un contrato) |
| Taller | ✅ Construido (órdenes de servicio, historial por unidad, solicitud de refacciones) |
| Compras | ✅ Construido (proveedores, órdenes de compra, aprobación por Dirección, cierra el flujo con Taller) |
| Logística | ✅ Construido (flotilla, traslados, cruce automático con el QR de Vigilancia) |
| Área de Daños | ✅ Construido (reportes de inspección, daños con evidencia fotográfica, cierra el ciclo con Taller y Ventas) |
| Gerencia | ✅ Construido (KPIs globales + estado de módulos) |
| Finanzas, RH, Sistemas/TI | 🕓 Definidos en la especificación, pendientes de construir |

## Arranque local

Necesitas una base PostgreSQL para desarrollo. La forma más rápida es una gratis en
[Neon](https://neon.tech) o [Vercel Postgres](https://vercel.com/storage/postgres) (unos
segundos, sin instalar nada); también sirve un Postgres local (`docker run -e
POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16`).

```bash
npm install
cp .env.example .env        # completa DATABASE_URL/DIRECT_URL y genera un AUTH_SECRET: openssl rand -base64 32
npx prisma migrate dev      # aplica el esquema a tu base
npm run db:seed             # crea usuarios demo, uno por rol
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Sin `BLOB_READ_WRITE_TOKEN` configurado,
las fotos de Área de Daños se guardan en `public/uploads/` para que puedas probar todo sin
depender de Vercel Blob localmente.

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

## Desplegar en Vercel

El proyecto ya está listo para desplegarse tal cual (Postgres + Vercel Blob, sin SQLite ni
disco local en el camino de producción). Pasos en el dashboard de Vercel:

1. **Importar el repositorio.** [vercel.com/new](https://vercel.com/new) → conecta la cuenta
   de GitHub si hace falta → selecciona `lykhos1998/celedimaquinaria` → rama
   `claude/new-session-ueky5w` (o la que quieras publicar) → Next.js se detecta solo, no hay
   que tocar el build command.
2. **Agregar una base Postgres.** Dentro del proyecto ya creado: pestaña **Storage** → **Create
   Database** → Postgres (o conecta un Neon/Supabase desde el Marketplace si prefieres). Al
   conectarlo, Vercel agrega automáticamente las variables de conexión al proyecto.
3. **Mapear esas variables a `DATABASE_URL` y `DIRECT_URL`.** En **Settings → Environment
   Variables**, agrega:
   - `DATABASE_URL` = el valor de la cadena **pooled** que te dio el paso anterior (con
     Vercel Postgres suele ser `POSTGRES_PRISMA_URL`; cópialo tal cual).
   - `DIRECT_URL` = el valor de la cadena **directa/no-pooled** (`POSTGRES_URL_NON_POOLING`
     con Vercel Postgres). Si tu proveedor solo te da una URL, usa la misma en ambas.
4. **Agregar Vercel Blob.** Misma pestaña **Storage** → **Create Database** → Blob. Al
   conectarlo agrega `BLOB_READ_WRITE_TOKEN` automáticamente — sin este paso, las fotos de
   Área de Daños seguirían "funcionando" pero se perderían en cada deploy porque el disco de
   una función serverless no persiste.
5. **Agregar `AUTH_SECRET`.** En **Settings → Environment Variables**, agrega `AUTH_SECRET`
   con un valor generado con `openssl rand -base64 32` (uno distinto al de tu `.env` local).
6. **Deploy.** Cualquier push a la rama conectada dispara un deploy; el propio `npm run
   build` corre `prisma migrate deploy` antes de `next build`, así que el esquema se aplica
   solo en cada deploy — no hace falta correr migraciones a mano.
7. **Sembrar usuarios demo (una sola vez).** La base de producción empieza vacía. Desde tu
   máquina, con las variables de producción:
   ```bash
   vercel env pull .env.production.local   # trae DATABASE_URL/DIRECT_URL reales de Vercel
   set -a && source .env.production.local && set +a
   npm run db:seed
   ```
   Después de esto ya puedes entrar con los mismos usuarios demo de la tabla de arriba, pero
   en la URL pública que te dio Vercel — compártela entre los dos dispositivos para la demo.

## Estructura

```
prisma/schema.prisma        Modelo de datos (roles, Vigilancia, Comercial, Equipos/Flota, Taller, Compras, Logística, Área de Daños)
prisma/seed.ts               Seed de usuarios demo
src/auth.ts                  Configuración de NextAuth (Credentials + JWT)
src/proxy.ts                  Protección de rutas por sesión (antes "middleware")
src/lib/roles.ts              Mapeo de módulos visibles por rol
src/lib/comercial.ts          Constantes y helpers del módulo Comercial (etapas, folios, estado de contrato)
src/lib/equipos.ts            Constantes y helpers del módulo Equipos/Flota (estados, folio)
src/lib/taller.ts             Constantes y helpers del módulo Taller (estados, folio de orden)
src/lib/compras.ts            Constantes y helpers del módulo Compras (estados, áreas, folio de OC)
src/lib/logistica.ts          Constantes, folio y el cruce con el QR de Vigilancia (procesarEscaneoQR)
src/lib/danos.ts              Constantes y folio del módulo Área de Daños
src/lib/storage.ts            Subida de archivos: Vercel Blob si hay token, si no disco local
src/app/(app)/layout.tsx      Shell con sidebar + header por rol
src/app/(app)/vigilancia/     Módulo Vigilancia
src/app/(app)/marketing/      Módulo Marketing (dashboard, leads, gasto publicitario)
src/app/(app)/ventas/         Módulo Ventas (pipeline kanban, mi cartera, contratos)
src/app/(app)/equipos/        Módulo Equipos/Flota (catálogo, tarifario)
src/app/(app)/taller/         Módulo Taller (órdenes de servicio, refacciones)
src/app/(app)/compras/        Módulo Compras (órdenes de compra, proveedores)
src/app/(app)/logistica/      Módulo Logística (traslados, flotilla)
src/app/(app)/danos/          Módulo Área de Daños (inspecciones, daños con foto)
src/app/(app)/gerencia/       Vista global de Gerencia
public/uploads/danos/         Evidencia fotográfica en desarrollo local sin Vercel Blob (no versionada)
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
  Servicio) ya tiene automatizadas sus tres transiciones principales: **Rentado** al cerrar
  un contrato en Ventas asignándole una unidad, **En Mantenimiento** al abrir una orden de
  servicio en Taller, y **En Tránsito** / de vuelta a Rentado o Disponible según el QR que
  escanea Vigilancia sobre el camión asignado en Logística (ver abajo). "Fuera de Servicio"
  sigue siendo manual desde el catálogo, para casos que ningún flujo automatizado cubre.

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

### Notas sobre el módulo Logística

- Programar un `Traslado` (folio `TR-XXXX`) solo lo agenda (`PROGRAMADO`); no mueve nada
  todavía. El cruce real ocurre en Vigilancia: al registrar un escaneo de QR de camión por
  placa, `src/lib/logistica.ts#procesarEscaneoQR` busca un traslado que coincida (uno
  `PROGRAMADO` para una Salida, uno `EN_TRANSITO` para una Llegada) y lo avanza, actualizando
  también el `Equipo` transportado — implementando literalmente el "cruce con el escaneo de
  QR de Vigilancia para confirmar salidas/llegadas reales" de la especificación.
- Al llegar, el equipo pasa a **Rentado** si el traslado era una Entrega, o a **Disponible**
  si era una Recolección (equipo de vuelta al patio). En la vida real una recolección
  probablemente debería pasar primero por inspección de Área de Daños antes de declararse
  disponible; se simplifica así porque ese módulo aún no existe.
- Si la placa escaneada no coincide con ningún camión de la Flotilla, o no hay un traslado en
  el estado esperado para esa placa, el escaneo se registra en Vigilancia igual que siempre
  y simplemente no dispara ningún cambio en Logística — el cruce es "mejor esfuerzo", nunca
  bloquea el registro del escaneo.

### Notas sobre el módulo Área de Daños

- Cierra el ciclo completo de devolución de equipo documentado en la especificación: un
  `ReporteInspeccion` (folio `INS-XXXX`) se liga a la unidad y, opcionalmente, al contrato
  de renta que regresa; cada `Danio` encontrado lleva tipo, severidad, descripción, costo
  estimado y evidencia fotográfica opcional.
- **Evidencia fotográfica real**: la foto se sube como archivo (server action que recibe
  `FormData` con un `File`, valida tipo `image/*` y tamaño ≤ 5 MB) — ver
  `src/lib/storage.ts#guardarArchivo`. Si `BLOB_READ_WRITE_TOKEN` está configurado (Vercel
  Blob conectado, ver "Desplegar en Vercel"), sube ahí y guarda la URL pública que regresa;
  si no, cae en `public/uploads/danos/` con un nombre aleatorio, para poder probar el flujo
  completo en desarrollo local sin depender de un servicio externo. Esa carpeta está en
  `.gitignore` porque es contenido subido por usuarios, no código fuente.
- Conexión hacia Taller: `src/app/(app)/taller/page.tsx` consulta los reportes que tienen
  al menos un daño y ninguna `OrdenServicio` ligada todavía, y el formulario de nueva orden
  los ofrece como cola — elegir uno fija la unidad, pone el tipo en Correctivo y prellena la
  descripción con los daños encontrados (editable antes de guardar).
- Conexión hacia Ventas: `src/app/(app)/ventas/contratos/page.tsx` suma el costo estimado de
  los daños ligados a cada contrato y lo muestra como badge "Daños por cobrar" — la
  especificación pide que Ventas gestione el cobro, pero como Finanzas todavía no existe,
  por ahora es solo el indicador de cuánto habría que cobrar, no un cargo real.

## Próximos pasos sugeridos

Según la sección 7 de la especificación:

1. Validar con Andrei los módulos marcados como pendientes en el documento, y el detalle de
   compras para RH/Sistemas-TI que sigue como punto abierto.
2. Finanzas es un buen candidato para el siguiente módulo: convertiría el "Daños por cobrar"
   de Ventas y los montos de Compras/Contratos en cuentas por cobrar/pagar reales.
3. Definir identidad de marca (logo, colores) — actualmente se usa un color vino/maroon
   neutral de referencia.
4. El proyecto ya corre sobre PostgreSQL + Vercel Blob y está listo para desplegarse (ver
   "Desplegar en Vercel" arriba); falta decidir con Andrei si esa es la plataforma
   definitiva o si se autoalojará (Docker) en otro lado.
