/*
  Warnings:

  - Added the required column `registradoPorId` to the `Danio` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Danio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reporteId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "severidad" TEXT NOT NULL DEFAULT 'LEVE',
    "descripcion" TEXT,
    "fotoUrl" TEXT,
    "costoEstimado" REAL,
    "registradoPorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Danio_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "ReporteInspeccion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Danio_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Danio" ("costoEstimado", "createdAt", "descripcion", "fotoUrl", "id", "reporteId", "severidad", "tipo") SELECT "costoEstimado", "createdAt", "descripcion", "fotoUrl", "id", "reporteId", "severidad", "tipo" FROM "Danio";
DROP TABLE "Danio";
ALTER TABLE "new_Danio" RENAME TO "Danio";
CREATE INDEX "Danio_reporteId_idx" ON "Danio"("reporteId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
