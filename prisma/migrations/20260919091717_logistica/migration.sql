-- CreateTable
CREATE TABLE "Camion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "modelo" TEXT,
    "capacidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Traslado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "camionId" TEXT NOT NULL,
    "tipoMovimiento" TEXT NOT NULL,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PROGRAMADO',
    "fechaProgramada" DATETIME NOT NULL,
    "fechaSalida" DATETIME,
    "fechaEntrega" DATETIME,
    "programadoPorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Traslado_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Traslado_camionId_fkey" FOREIGN KEY ("camionId") REFERENCES "Camion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Traslado_programadoPorId_fkey" FOREIGN KEY ("programadoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
