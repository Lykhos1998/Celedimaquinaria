-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT,
    "email" TEXT,
    "canal" TEXT NOT NULL,
    "tipoTrabajo" TEXT NOT NULL,
    "ubicacion" TEXT,
    "valorEstimado" REAL,
    "etapa" TEXT NOT NULL DEFAULT 'LEAD_NUEVO',
    "temperatura" TEXT NOT NULL DEFAULT 'TIBIO',
    "motivoPerdida" TEXT,
    "valorPerdido" REAL,
    "asesorId" TEXT,
    "creadoPorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cerradoAt" DATETIME,
    CONSTRAINT "Lead_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Lead_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GastoPublicitario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "plataforma" TEXT NOT NULL,
    "canal" TEXT,
    "monto" REAL NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registradoPorId" TEXT NOT NULL,
    CONSTRAINT "GastoPublicitario_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contrato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "valorMensual" REAL NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contrato_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
