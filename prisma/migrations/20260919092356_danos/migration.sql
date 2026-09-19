-- CreateTable
CREATE TABLE "ReporteInspeccion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "contratoId" TEXT,
    "observaciones" TEXT,
    "inspeccionadoPorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReporteInspeccion_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ReporteInspeccion_contratoId_fkey" FOREIGN KEY ("contratoId") REFERENCES "Contrato" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ReporteInspeccion_inspeccionadoPorId_fkey" FOREIGN KEY ("inspeccionadoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Danio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL DEFAULT 'LEVE',
    "descripcion" TEXT,
    "fotoUrl" TEXT,
    "costoEstimado" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Danio_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "ReporteInspeccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrdenServicio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'ABIERTA',
    "creadoPorId" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reporteInspeccionId" TEXT,
    CONSTRAINT "OrdenServicio_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenServicio_creadoPorId_fkey" FOREIGN KEY ("creadoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenServicio_reporteInspeccionId_fkey" FOREIGN KEY ("reporteInspeccionId") REFERENCES "ReporteInspeccion" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrdenServicio" ("creadoPorId", "createdAt", "descripcion", "equipoId", "estado", "fechaFin", "fechaInicio", "folio", "id", "tipo") SELECT "creadoPorId", "createdAt", "descripcion", "equipoId", "estado", "fechaFin", "fechaInicio", "folio", "id", "tipo" FROM "OrdenServicio";
DROP TABLE "OrdenServicio";
ALTER TABLE "new_OrdenServicio" RENAME TO "OrdenServicio";
CREATE UNIQUE INDEX "OrdenServicio_folio_key" ON "OrdenServicio"("folio");
CREATE INDEX "OrdenServicio_equipoId_idx" ON "OrdenServicio"("equipoId");
CREATE INDEX "OrdenServicio_estado_idx" ON "OrdenServicio"("estado");
CREATE INDEX "OrdenServicio_reporteInspeccionId_idx" ON "OrdenServicio"("reporteInspeccionId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ReporteInspeccion_folio_key" ON "ReporteInspeccion"("folio");

-- CreateIndex
CREATE INDEX "ReporteInspeccion_equipoId_idx" ON "ReporteInspeccion"("equipoId");

-- CreateIndex
CREATE INDEX "ReporteInspeccion_contratoId_idx" ON "ReporteInspeccion"("contratoId");

-- CreateIndex
CREATE INDEX "Danio_reporteId_idx" ON "Danio"("reporteId");
