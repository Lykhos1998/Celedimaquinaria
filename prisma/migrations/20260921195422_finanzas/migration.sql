-- CreateEnum
CREATE TYPE "ConceptoCobro" AS ENUM ('RENTA_MENSUAL', 'DANO', 'OTRO');

-- AlterTable
ALTER TABLE "OrdenCompra" ADD COLUMN     "fechaPago" TIMESTAMP(3),
ADD COLUMN     "pagada" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pagadoPorId" TEXT;

-- CreateTable
CREATE TABLE "CuentaCobrar" (
    "id" TEXT NOT NULL,
    "folio" TEXT NOT NULL,
    "concepto" "ConceptoCobro" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" DOUBLE PRECISION NOT NULL,
    "cobrada" BOOLEAN NOT NULL DEFAULT false,
    "contratoId" TEXT,
    "danioId" TEXT,
    "fechaVencimiento" TIMESTAMP(3) NOT NULL,
    "fechaCobro" TIMESTAMP(3),
    "registradoPorId" TEXT NOT NULL,
    "cobradoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CuentaCobrar_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CuentaCobrar_folio_key" ON "CuentaCobrar"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "CuentaCobrar_danioId_key" ON "CuentaCobrar"("danioId");

-- CreateIndex
CREATE INDEX "CuentaCobrar_contratoId_idx" ON "CuentaCobrar"("contratoId");

-- CreateIndex
CREATE INDEX "CuentaCobrar_cobrada_idx" ON "CuentaCobrar"("cobrada");

-- AddForeignKey
ALTER TABLE "OrdenCompra" ADD CONSTRAINT "OrdenCompra_pagadoPorId_fkey" FOREIGN KEY ("pagadoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_danioId_fkey" FOREIGN KEY ("danioId") REFERENCES "Danio"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CuentaCobrar" ADD CONSTRAINT "CuentaCobrar_cobradoPorId_fkey" FOREIGN KEY ("cobradoPorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
