/*
  Warnings:

  - You are about to drop the column `configId` on the `PlanPagament` table. All the data in the column will be lost.
  - Made the column `accountId` on table `Pagament` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `value` to the `PlanIncome` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `PlanPagament` table without a default value. This is not possible if the table is not empty.
  - Made the column `accountId` on table `PlanPagament` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pagament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "desc" TEXT,
    "accountId" INTEGER NOT NULL,
    "planPagamentId" INTEGER,
    "importance" TEXT,
    CONSTRAINT "Pagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Pagament_planPagamentId_fkey" FOREIGN KEY ("planPagamentId") REFERENCES "PlanPagament" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pagament" ("accountId", "date", "desc", "id", "importance", "name", "planPagamentId", "value") SELECT "accountId", "date", "desc", "id", "importance", "name", "planPagamentId", "value" FROM "Pagament";
DROP TABLE "Pagament";
ALTER TABLE "new_Pagament" RENAME TO "Pagament";
CREATE TABLE "new_PlanIncome" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" INTEGER NOT NULL,
    "configId" INTEGER NOT NULL,
    CONSTRAINT "PlanIncome_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlanIncome_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlanIncome" ("accountId", "automatic", "configId", "date", "desc", "id", "name", "recurrent") SELECT "accountId", "automatic", "configId", "date", "desc", "id", "name", "recurrent" FROM "PlanIncome";
DROP TABLE "PlanIncome";
ALTER TABLE "new_PlanIncome" RENAME TO "PlanIncome";
CREATE TABLE "new_PlanPagament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "PlanPagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlanPagament" ("accountId", "automatic", "date", "desc", "id", "name", "recurrent") SELECT "accountId", "automatic", "date", "desc", "id", "name", "recurrent" FROM "PlanPagament";
DROP TABLE "PlanPagament";
ALTER TABLE "new_PlanPagament" RENAME TO "PlanPagament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
