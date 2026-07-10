/*
  Warnings:

  - You are about to drop the column `customerId` on the `sites` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sites" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cityId" INTEGER NOT NULL,
    "address" TEXT NOT NULL,
    "mapLink" TEXT,
    "sizeSqm" DECIMAL NOT NULL,
    "accessNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "sites_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_sites" ("accessNotes", "address", "cityId", "createdAt", "id", "mapLink", "sizeSqm", "updatedAt") SELECT "accessNotes", "address", "cityId", "createdAt", "id", "mapLink", "sizeSqm", "updatedAt" FROM "sites";
DROP TABLE "sites";
ALTER TABLE "new_sites" RENAME TO "sites";
CREATE INDEX "sites_cityId_idx" ON "sites"("cityId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
