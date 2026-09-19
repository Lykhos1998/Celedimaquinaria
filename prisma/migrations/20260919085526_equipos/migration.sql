-- CreateTable
CREATE TABLE "TarifaEquipo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "clasificacion" TEXT NOT NULL,
    "alturaCapacidad" TEXT,
    "precioMensual" REAL NOT NULL,
    "precioDia1" REAL NOT NULL,
    "precioDia7" REAL NOT NULL,
    "precioDia15" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "anio" INTEGER NOT NULL,
    "numeroSerie" TEXT,
    "categoria" TEXT NOT NULL,
    "combustible" TEXT NOT NULL,
    "altura" REAL,
    "horometro" REAL NOT NULL DEFAULT 0,
    "estado" TEXT NOT NULL DEFAULT 'DISPONIBLE',
    "tarifaId" TEXT,
    "actualizadoPorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Equipo_tarifaId_fkey" FOREIGN KEY ("tarifaId") REFERENCES "TarifaEquipo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Equipo_actualizadoPorId_fkey" FOREIGN KEY ("actualizadoPorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contrato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "asesorId" TEXT NOT NULL,
    "valorMensual" REAL NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "fechaFin" DATETIME NOT NULL,
    "cancelado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "equipoId" TEXT,
    CONSTRAINT "Contrato_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_asesorId_fkey" FOREIGN KEY ("asesorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Contrato_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Contrato" ("asesorId", "cancelado", "createdAt", "fechaFin", "fechaInicio", "folio", "id", "leadId", "valorMensual") SELECT "asesorId", "cancelado", "createdAt", "fechaFin", "fechaInicio", "folio", "id", "leadId", "valorMensual" FROM "Contrato";
DROP TABLE "Contrato";
ALTER TABLE "new_Contrato" RENAME TO "Contrato";
CREATE UNIQUE INDEX "Contrato_folio_key" ON "Contrato"("folio");
CREATE UNIQUE INDEX "Contrato_leadId_key" ON "Contrato"("leadId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Equipo_codigo_key" ON "Equipo"("codigo");

-- CreateIndex
CREATE INDEX "Equipo_estado_idx" ON "Equipo"("estado");

-- CreateIndex
CREATE INDEX "Equipo_categoria_idx" ON "Equipo"("categoria");
