/*
  Warnings:

  - You are about to drop the column `configId` on the `PlanIncome` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlanIncome" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "PlanIncome_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlanIncome" ("accountId", "automatic", "date", "desc", "id", "name", "recurrent", "value") SELECT "accountId", "automatic", "date", "desc", "id", "name", "recurrent", "value" FROM "PlanIncome";
DROP TABLE "PlanIncome";
ALTER TABLE "new_PlanIncome" RENAME TO "PlanIncome";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
