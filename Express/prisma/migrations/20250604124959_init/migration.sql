/*
  Warnings:

  - The primary key for the `Account` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `Account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Config` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Config` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `Config` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Income` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `Income` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Income` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `planIncomeId` on the `Income` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `IncomeCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `configId` on the `IncomeCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `IncomeCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Investments` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `Investments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Investments` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Pagament` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `Pagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Pagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `planPagamentId` on the `Pagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `PagamentCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `configId` on the `PagamentCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `PagamentCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `PlanIncome` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `PlanIncome` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `configId` on the `PlanIncome` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `PlanIncome` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `PlanPagament` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `PlanPagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `configId` on the `PlanPagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `PlanPagament` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `Savings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `accountId` on the `Savings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `id` on the `Savings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `value` on the `Savings` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `A` on the `_IncomeToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `B` on the `_IncomeToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `A` on the `_PagamentToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `B` on the `_PagamentToCategory` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Account" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "openDate" DATETIME,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Account" ("id", "name", "openDate", "userId", "value") SELECT "id", "name", "openDate", "userId", "value" FROM "Account";
DROP TABLE "Account";
ALTER TABLE "new_Account" RENAME TO "Account";
CREATE TABLE "new_Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "can_modify_date" BOOLEAN NOT NULL,
    "can_account_go_bellow_zero" BOOLEAN NOT NULL,
    "put_change_current_value" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Config" ("can_account_go_bellow_zero", "can_modify_date", "id", "put_change_current_value", "userId") SELECT "can_account_go_bellow_zero", "can_modify_date", "id", "put_change_current_value", "userId" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");
CREATE TABLE "new_Income" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "desc" TEXT,
    "accountId" INTEGER NOT NULL,
    "planIncomeId" INTEGER NOT NULL,
    CONSTRAINT "Income_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_planIncomeId_fkey" FOREIGN KEY ("planIncomeId") REFERENCES "PlanIncome" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Income" ("accountId", "date", "desc", "id", "name", "planIncomeId", "value") SELECT "accountId", "date", "desc", "id", "name", "planIncomeId", "value" FROM "Income";
DROP TABLE "Income";
ALTER TABLE "new_Income" RENAME TO "Income";
CREATE TABLE "new_IncomeCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "configId" INTEGER NOT NULL,
    CONSTRAINT "IncomeCategory_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_IncomeCategory" ("configId", "desc", "id", "name") SELECT "configId", "desc", "id", "name" FROM "IncomeCategory";
DROP TABLE "IncomeCategory";
ALTER TABLE "new_IncomeCategory" RENAME TO "IncomeCategory";
CREATE TABLE "new_Investments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "type" TEXT,
    "startDate" DATETIME NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Investments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Investments" ("accountId", "id", "interestRate", "name", "startDate", "type", "value") SELECT "accountId", "id", "interestRate", "name", "startDate", "type", "value" FROM "Investments";
DROP TABLE "Investments";
ALTER TABLE "new_Investments" RENAME TO "Investments";
CREATE TABLE "new_Pagament" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "desc" TEXT,
    "accountId" INTEGER,
    "planPagamentId" INTEGER,
    "importance" TEXT,
    CONSTRAINT "Pagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pagament_planPagamentId_fkey" FOREIGN KEY ("planPagamentId") REFERENCES "PlanPagament" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Pagament" ("accountId", "date", "desc", "id", "importance", "name", "planPagamentId", "value") SELECT "accountId", "date", "desc", "id", "importance", "name", "planPagamentId", "value" FROM "Pagament";
DROP TABLE "Pagament";
ALTER TABLE "new_Pagament" RENAME TO "Pagament";
CREATE TABLE "new_PagamentCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "configId" INTEGER NOT NULL,
    CONSTRAINT "PagamentCategory_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PagamentCategory" ("configId", "desc", "id", "name") SELECT "configId", "desc", "id", "name" FROM "PagamentCategory";
DROP TABLE "PagamentCategory";
ALTER TABLE "new_PagamentCategory" RENAME TO "PagamentCategory";
CREATE TABLE "new_PlanIncome" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
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
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" INTEGER,
    "configId" INTEGER NOT NULL,
    CONSTRAINT "PlanPagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PlanPagament_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlanPagament" ("accountId", "automatic", "configId", "date", "desc", "id", "name", "recurrent") SELECT "accountId", "automatic", "configId", "date", "desc", "id", "name", "recurrent" FROM "PlanPagament";
DROP TABLE "PlanPagament";
ALTER TABLE "new_PlanPagament" RENAME TO "PlanPagament";
CREATE TABLE "new_Savings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "moneyGoal" REAL,
    "finalDate" DATETIME,
    "startDate" DATETIME,
    "removable" BOOLEAN NOT NULL,
    "accountId" INTEGER NOT NULL,
    CONSTRAINT "Savings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Savings" ("accountId", "finalDate", "id", "moneyGoal", "name", "removable", "startDate", "value") SELECT "accountId", "finalDate", "id", "moneyGoal", "name", "removable", "startDate", "value" FROM "Savings";
DROP TABLE "Savings";
ALTER TABLE "new_Savings" RENAME TO "Savings";
CREATE TABLE "new__IncomeToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_IncomeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Income" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IncomeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "IncomeCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__IncomeToCategory" ("A", "B") SELECT "A", "B" FROM "_IncomeToCategory";
DROP TABLE "_IncomeToCategory";
ALTER TABLE "new__IncomeToCategory" RENAME TO "_IncomeToCategory";
CREATE UNIQUE INDEX "_IncomeToCategory_AB_unique" ON "_IncomeToCategory"("A", "B");
CREATE INDEX "_IncomeToCategory_B_index" ON "_IncomeToCategory"("B");
CREATE TABLE "new__PagamentToCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_PagamentToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Pagament" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PagamentToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PagamentCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__PagamentToCategory" ("A", "B") SELECT "A", "B" FROM "_PagamentToCategory";
DROP TABLE "_PagamentToCategory";
ALTER TABLE "new__PagamentToCategory" RENAME TO "_PagamentToCategory";
CREATE UNIQUE INDEX "_PagamentToCategory_AB_unique" ON "_PagamentToCategory"("A", "B");
CREATE INDEX "_PagamentToCategory_B_index" ON "_PagamentToCategory"("B");
CREATE TABLE "new_user" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER,
    "email" TEXT
);
INSERT INTO "new_user" ("age", "email", "id", "password", "username") SELECT "age", "email", "id", "password", "username" FROM "user";
DROP TABLE "user";
ALTER TABLE "new_user" RENAME TO "user";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
