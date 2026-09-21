-- CreateEnum
CREATE TYPE "TipoPermiso" AS ENUM ('VACACIONES', 'PERMISO', 'INCAPACIDAD', 'OTRO');

-- CreateEnum
CREATE TYPE "EstadoPermiso" AS ENUM ('SOLICITADO', 'APROBADO', 'RECHAZADO');

-- CreateEnum
CREATE TYPE "CategoriaTicket" AS ENUM ('HARDWARE', 'SOFTWARE', 'RED', 'OTRO');

-- CreateEnum
CREATE TYPE "PrioridadTicket" AS ENUM ('BAJA', 'MEDIA', 'ALTA');

-- CreateEnum
CREATE TYPE "EstadoTicket" AS ENUM ('ABIERTO', 'RESUELTO');

-- CreateEnum
CREATE TYPE "TipoDispositivo" AS ENUM ('LAPTOP', 'DESKTOP', 'MONITOR', 'CELULAR', 'OTRO');

-- AlterTable
ALTER TABLE "ValeSalida" ADD COLUMN     "dispositivoId" TEXT;

-- CreateTable
CREATE TABLE "Permiso" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "tipo" "TipoPermiso" NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "estado" "EstadoPermiso" NOT NULL DEFAULT 'SOLICITADO',
    "registradoPorId" TEXT NOT NULL,
    "resueltoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permiso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nomina" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "colaboradorId" TEXT NOT NULL,
    "periodoInicio" TIMESTAMP(3) NOT NULL,
    "periodoFin" TIMESTAMP(3) NOT NULL,
    "diasAsistidos" INTEGER NOT NULL,
    "sueldoPeriodo" DOUBLE PRECISION NOT NULL,
    "pagada" BOOLEAN NOT NULL DEFAULT false,
    "fechaPago" TIMESTAMP(3),
    "generadoPorId" TEXT NOT NULL,
    "pagadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nomina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketSoporte" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" "CategoriaTicket" NOT NULL,
    "prioridad" "PrioridadTicket" NOT NULL DEFAULT 'MEDIA',
    "estado" "EstadoTicket" NOT NULL DEFAULT 'ABIERTO',
    "reportadoPorId" TEXT NOT NULL,
    "resueltoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resueltoAt" TIMESTAMP(3),

    CONSTRAINT "TicketSoporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispositivo" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoDispositivo" NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "numeroSerie" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "colaboradorId" TEXT,
    "fechaAsignacion" TIMESTAMP(3),
    "asignadoPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Dispositivo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_folio_key" ON "Permiso"("folio");

-- CreateIndex
CREATE INDEX "Permiso_colaboradorId_idx" ON "Permiso"("colaboradorId");

-- CreateIndex
CREATE INDEX "Permiso_estado_idx" ON "Permiso"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Nomina_folio_key" ON "Nomina"("folio");

-- CreateIndex
CREATE INDEX "Nomina_colaboradorId_idx" ON "Nomina"("colaboradorId");

-- CreateIndex
CREATE UNIQUE INDEX "TicketSoporte_folio_key" ON "TicketSoporte"("folio");

-- CreateIndex
CREATE INDEX "TicketSoporte_estado_idx" ON "TicketSoporte"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "Dispositivo_codigo_key" ON "Dispositivo"("codigo");

-- CreateIndex
CREATE INDEX "Dispositivo_colaboradorId_idx" ON "Dispositivo"("colaboradorId");

-- AddForeignKey
ALTER TABLE "ValeSalida" ADD CONSTRAINT "ValeSalida_dispositivoId_fkey" FOREIGN KEY ("dispositivoId") REFERENCES "Dispositivo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Permiso" ADD CONSTRAINT "Permiso_resueltoPorId_fkey" FOREIGN KEY ("resueltoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_generadoPorId_fkey" FOREIGN KEY ("generadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nomina" ADD CONSTRAINT "Nomina_pagadoPorId_fkey" FOREIGN KEY ("pagadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketSoporte" ADD CONSTRAINT "TicketSoporte_reportadoPorId_fkey" FOREIGN KEY ("reportadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketSoporte" ADD CONSTRAINT "TicketSoporte_resueltoPorId_fkey" FOREIGN KEY ("resueltoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispositivo" ADD CONSTRAINT "Dispositivo_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispositivo" ADD CONSTRAINT "Dispositivo_asignadoPorId_fkey" FOREIGN KEY ("asignadoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
