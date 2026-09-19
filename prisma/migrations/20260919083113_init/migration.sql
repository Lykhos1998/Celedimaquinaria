-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AsistenciaRegistro" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "colaboradorId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,
    CONSTRAINT "AsistenciaRegistro_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AsistenciaRegistro_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "QRVehiculo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "placa" TEXT NOT NULL,
    "codigoQR" TEXT NOT NULL,
    "movimiento" TEXT NOT NULL,
    "destino" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,
    CONSTRAINT "QRVehiculo_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ValeSalida" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "activo" TEXT NOT NULL,
    "solicitanteId" TEXT NOT NULL,
    "autorizadoPorId" TEXT,
    "validadoPorId" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'SOLICITADO',
    "fechaSalida" DATETIME,
    "fechaRetorno" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ValeSalida_solicitanteId_fkey" FOREIGN KEY ("solicitanteId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ValeSalida_autorizadoPorId_fkey" FOREIGN KEY ("autorizadoPorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ValeSalida_validadoPorId_fkey" FOREIGN KEY ("validadoPorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncidenteSeguridad" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "descripcion" TEXT NOT NULL,
    "severidad" TEXT NOT NULL DEFAULT 'BAJA',
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,
    CONSTRAINT "IncidenteSeguridad_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AsistenciaRegistro_colaboradorId_idx" ON "AsistenciaRegistro"("colaboradorId");

-- CreateIndex
CREATE INDEX "QRVehiculo_placa_idx" ON "QRVehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "ValeSalida_folio_key" ON "ValeSalida"("folio");
