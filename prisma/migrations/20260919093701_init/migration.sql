-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('VIGILANTE', 'MARKETING', 'ASESOR_VENTAS', 'INSPECTOR_DANOS', 'COMPRAS', 'TALLER', 'FINANZAS', 'LOGISTICA', 'RH', 'SISTEMAS_TI', 'GERENCIA');

-- CreateEnum
CREATE TYPE "TipoChecada" AS ENUM ('ENTRADA', 'SALIDA', 'ENTRADA_COMIDA', 'SALIDA_COMIDA');

-- CreateEnum
CREATE TYPE "MovimientoQR" AS ENUM ('SALIDA', 'LLEGADA');

-- CreateEnum
CREATE TYPE "EstadoVale" AS ENUM ('SOLICITADO', 'AUTORIZADO', 'EN_SALIDA', 'RETORNADO', 'VENCIDO');

-- CreateEnum
CREATE TYPE "SeveridadIncidente" AS ENUM ('BAJA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "CanalLead" AS ENUM ('REDES_SOCIALES', 'COTIZACION_DIRECTA', 'TELEFONO', 'FORMULARIO_WEB');

-- CreateEnum
CREATE TYPE "TipoTrabajo" AS ENUM ('RENTA', 'VENTA');

-- CreateEnum
CREATE TYPE "EtapaLead" AS ENUM ('LEAD_NUEVO', 'CALIFICADO', 'CONTACTADO', 'PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO');

-- CreateEnum
CREATE TYPE "Temperatura" AS ENUM ('FRIO', 'TIBIO', 'CALIENTE');

-- CreateEnum
CREATE TYPE "EstadoEquipo" AS ENUM ('DISPONIBLE', 'RENTADO', 'EN_TRANSITO', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO');

-- CreateEnum
CREATE TYPE "Combustible" AS ENUM ('DIESEL', 'GASOLINA', 'ELECTRICO', 'GAS');

-- CreateEnum
CREATE TYPE "TipoServicio" AS ENUM ('PREVENTIVO', 'CORRECTIVO');

-- CreateEnum
CREATE TYPE "EstadoOrdenServicio" AS ENUM ('ABIERTA', 'EN_PROCESO', 'ESPERANDO_REFACCION', 'COMPLETADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoRefaccion" AS ENUM ('SOLICITADA', 'RECIBIDA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "EstadoOrdenCompra" AS ENUM ('PENDIENTE_APROBACION', 'APROBADA', 'RECHAZADA', 'RECIBIDA');

-- CreateEnum
CREATE TYPE "AreaSolicitante" AS ENUM ('TALLER', 'RH', 'SISTEMAS_TI', 'OTRO');

-- CreateEnum
CREATE TYPE "TipoMovimiento" AS ENUM ('ENTREGA', 'RECOLECCION');

-- CreateEnum
CREATE TYPE "EstadoTraslado" AS ENUM ('PROGRAMADO', 'EN_TRANSITO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "SeveridadDanio" AS ENUM ('LEVE', 'MODERADA', 'GRAVE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AsistenciaRegistro" (
    "id" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "tipo" "TipoChecada" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,

    CONSTRAINT "AsistenciaRegistro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QRVehiculo" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "codigoQR" TEXT NOT NULL,
    "movimiento" "MovimientoQR" NOT NULL,
    "destino" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,

    CONSTRAINT "QRVehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ValeSalida" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "activo" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "autorizadoPorId" TEXT,
    "validadoPorId" TEXT,
    "estado" "EstadoVale" NOT NULL DEFAULT 'SOLICITADO',
    "fechaSalida" TIMESTAMP(3),
    "fechaRetorno" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ValeSalida_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidenteSeguridad" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "severidad" "SeveridadIncidente" NOT NULL DEFAULT 'BAJA',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,

    CONSTRAINT "IncidenteSeguridad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "canal" "CanalLead" NOT NULL,
    "tipoTrabajo" "TipoTrabajo" NOT NULL,
    "ubicacion" TEXT,
    "valorEstimado" DOUBLE PRECISION,
    "etapa" "EtapaLead" NOT NULL DEFAULT 'LEAD_NUEVO',
    "temperatura" "Temperatura" NOT NULL DEFAULT 'TIBIO',
    "motivoPerdida" TEXT,
    "valorPerdido" DOUBLE PRECISION,
    "asesorId" TEXT,
    "creadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cerradoAt" TIMESTAMP(3),

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GastoPublicitario" (
    "id" TEXT NOT NULL,
    "plataforma" TEXT NOT NULL,
    "canal" "CanalLead",
    "monto" DOUBLE PRECISION NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,

    CONSTRAINT "GastoPublicitario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "valorMensual" DOUBLE PRECISION NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipoId" TEXT,

    CONSTRAINT "Contrato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarifaEquipo" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "alturaCapacidad" TEXT,
    "precioMensual" DOUBLE PRECISION NOT NULL,
    "precioDia1" DOUBLE PRECISION NOT NULL,
    "precioDia7" DOUBLE PRECISION NOT NULL,
    "precioDia15" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TarifaEquipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "numeroSerie" TEXT,
    "categoria" TEXT NOT NULL,
    "combustible" "Combustible" NOT NULL,
    "altura" DOUBLE PRECISION,
    "horometro" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "estado" "EstadoEquipo" NOT NULL DEFAULT 'DISPONIBLE',
    "tarifaId" TEXT,
    "actualizadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenServicio" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "tipo" "TipoServicio" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoOrdenServicio" NOT NULL DEFAULT 'ABIERTA',
    "creadoPorId" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteInspeccionId" TEXT,

    CONSTRAINT "OrdenServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SolicitudRefaccion" (
    "id" TEXT NOT NULL,
    "ordenServicioId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "estado" "EstadoRefaccion" NOT NULL DEFAULT 'SOLICITADA',
    "solicitadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SolicitudRefaccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "categoria" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Proveedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "area" "AreaSolicitante" NOT NULL,
    "estado" "EstadoOrdenCompra" NOT NULL DEFAULT 'PENDIENTE_APROBACION',
    "refaccionId" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "aprobadoPorId" TEXT,
    "fechaAprobacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrdenCompra_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Camion" (
    "id" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "modelo" TEXT,
    "capacidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Camion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Traslado" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "camionId" TEXT NOT NULL,
    "tipoMovimiento" "TipoMovimiento" NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "estado" "EstadoTraslado" NOT NULL DEFAULT 'PROGRAMADO',
    "fechaProgramada" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3),
    "fechaEntrega" TIMESTAMP(3),
    "programadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Traslado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReporteInspeccion" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "contratoId" TEXT,
    "observaciones" TEXT,
    "inspeccionadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReporteInspeccion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Danio" (
    "id" TEXT NOT NULL,
    "reporteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" "SeveridadDanio" NOT NULL DEFAULT 'LEVE',
    "descripcion" TEXT,
    "fotoUrl" TEXT,
    "costoEstimado" DOUBLE PRECISION,
    "registradoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Danio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AsistenciaRegistro_colaboradorId_idx" ON "AsistenciaRegistro"("colaboradorId");

-- CreateIndex
CREATE INDEX "QRVehiculo_placa_idx" ON "QRVehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "ValeSalida_folio_key" ON "ValeSalida"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_folio_key" ON "Lead"("folio");

-- CreateIndex
CREATE INDEX "Lead_canal_idx" ON "Lead"("canal");

-- CreateIndex
CREATE INDEX "Lead_etapa_idx" ON "Lead"("etapa");

-- CreateIndex
CREATE INDEX "Lead_asesorId_idx" ON "Lead"("asesorId");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_folio_key" ON "Contrato"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "Contrato_leadId_key" ON "Contrato"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");

-- CreateIndex
CREATE INDEX "Equipo_estado_idx" ON "Equipo"("estado");

-- CreateIndex
CREATE INDEX "Equipo_categoria_idx" ON "Equipo"("categoria");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenServicio_folio_key" ON "OrdenServicio"("folio");

-- CreateIndex
CREATE INDEX "OrdenServicio_equipoId_idx" ON "OrdenServicio"("equipoId");

-- CreateIndex
CREATE INDEX "OrdenServicio_estado_idx" ON "OrdenServicio"("estado");

-- CreateIndex
CREATE INDEX "OrdenServicio_reporteInspeccionId_idx" ON "OrdenServicio"("reporteInspeccionId");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_folio_key" ON "OrdenCompra"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_refaccionId_key" ON "OrdenCompra"("refaccionId");

-- CreateIndex
CREATE INDEX "OrdenCompra_estado_idx" ON "OrdenCompra"("estado");

-- CreateIndex
CREATE INDEX "OrdenCompra_area_idx" ON "OrdenCompra"("area");

-- CreateIndex
CREATE UNIQUE INDEX "Camion_placa_key" ON "Camion"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Traslado_folio_key" ON "Traslado"("folio");

-- CreateIndex
CREATE INDEX "Traslado_estado_idx" ON "Traslado"("estado");

-- CreateIndex
CREATE INDEX "Traslado_equipoId_idx" ON "Traslado"("equipoId");

-- CreateIndex
CREATE INDEX "Traslado_camionId_idx" ON "Traslado"("camionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReporteInspeccion_folio_key" ON "ReporteInspeccion"("folio");

-- CreateIndex
CREATE INDEX "ReporteInspeccion_equipoId_idx" ON "ReporteInspeccion"("equipoId");

-- CreateIndex
CREATE INDEX "ReporteInspeccion_contratoId_idx" ON "ReporteInspeccion"("contratoId");

-- CreateIndex
CREATE INDEX "Danio_reporteId_idx" ON "Danio"("reporteId");

-- AddForeignKey
ALTER TABLE "AsistenciaRegistro" ADD CONSTRAINT "AsistenciaRegistro_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AsistenciaRegistro" ADD CONSTRAINT "AsistenciaRegistro_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QRVehiculo" ADD CONSTRAINT "QRVehiculo_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValeSalida" ADD CONSTRAINT "ValeSalida_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValeSalida" ADD CONSTRAINT "ValeSalida_autorizadoPorId_fkey" FOREIGN KEY ("autorizadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ValeSalida" ADD CONSTRAINT "ValeSalida_validadoPorId_fkey" FOREIGN KEY ("validadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncidenteSeguridad" ADD CONSTRAINT "IncidenteSeguridad_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GastoPublicitario" ADD CONSTRAINT "GastoPublicitario_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contrato" ADD CONSTRAINT "Contrato_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_tarifaId_fkey" FOREIGN KEY ("tarifaId") REFERENCES "TarifaEquipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Equipo" ADD CONSTRAINT "Equipo_actualizadoPorId_fkey" FOREIGN KEY ("actualizadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_reporteInspeccionId_fkey" FOREIGN KEY ("reporteInspeccionId") REFERENCES "ReporteInspeccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudRefaccion" ADD CONSTRAINT "SolicitudRefaccion_ordenServicioId_fkey" FOREIGN KEY ("ordenServicioId") REFERENCES "OrdenServicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudRefaccion" ADD CONSTRAINT "SolicitudRefaccion_solicitadoPorId_fkey" FOREIGN KEY ("solicitadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_refaccionId_fkey" FOREIGN KEY ("refaccionId") REFERENCES "SolicitudRefaccion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Traslado" ADD CONSTRAINT "Traslado_programadoPorId_fkey" FOREIGN KEY ("programadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteInspeccion" ADD CONSTRAINT "ReporteInspeccion_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteInspeccion" ADD CONSTRAINT "ReporteInspeccion_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReporteInspeccion" ADD CONSTRAINT "ReporteInspeccion_inspeccionadoPorId_fkey" FOREIGN KEY ("inspeccionadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Danio" ADD CONSTRAINT "Danio_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "ReporteInspeccion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Danio" ADD CONSTRAINT "Danio_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
