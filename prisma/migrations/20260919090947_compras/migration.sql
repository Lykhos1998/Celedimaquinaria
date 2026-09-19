-- CreateTable
CREATE TABLE "Proveedor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nombre" TEXT NOT NULL,
    "contacto" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "categoria" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "OrdenCompra" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "folio" TEXT NOT NULL,
    "proveedorId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "monto" REAL NOT NULL,
    "area" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'PENDIENTE_APROBACION',
    "refaccionId" TEXT,
    "registradoPorId" TEXT NOT NULL,
    "aprobadoPorId" TEXT,
    "fechaAprobacion" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrdenCompra_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenCompra_refaccionId_fkey" FOREIGN KEY ("refaccionId") REFERENCES "SolicitudRefaccion" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "OrdenCompra_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrdenCompra_aprobadoPorId_fkey" FOREIGN KEY ("aprobadoPorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_folio_key" ON "OrdenCompra"("folio");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenCompra_refaccionId_key" ON "OrdenCompra"("refaccionId");

-- CreateIndex
CREATE INDEX "OrdenCompra_estado_idx" ON "OrdenCompra"("estado");

-- CreateIndex
CREATE INDEX "OrdenCompra_area_idx" ON "OrdenCompra"("area");
