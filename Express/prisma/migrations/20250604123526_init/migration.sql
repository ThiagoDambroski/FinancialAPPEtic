-- CreateTable
CREATE TABLE "user" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "age" INTEGER,
    "email" TEXT
);

-- CreateTable
CREATE TABLE "Config" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "can_modify_date" BOOLEAN NOT NULL,
    "can_account_go_bellow_zero" BOOLEAN NOT NULL,
    "put_change_current_value" BOOLEAN NOT NULL,
    "userId" BIGINT NOT NULL,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Account" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "openDate" DATETIME,
    "userId" BIGINT NOT NULL,
    CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Income" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "desc" TEXT,
    "accountId" BIGINT NOT NULL,
    "planIncomeId" BIGINT NOT NULL,
    CONSTRAINT "Income_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Income_planIncomeId_fkey" FOREIGN KEY ("planIncomeId") REFERENCES "PlanIncome" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IncomeCategory" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "configId" BIGINT NOT NULL,
    CONSTRAINT "IncomeCategory_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanIncome" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" BIGINT NOT NULL,
    "configId" BIGINT NOT NULL,
    CONSTRAINT "PlanIncome_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlanIncome_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pagament" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "date" DATETIME NOT NULL,
    "desc" TEXT,
    "accountId" BIGINT,
    "planPagamentId" BIGINT,
    "importance" TEXT,
    CONSTRAINT "Pagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Pagament_planPagamentId_fkey" FOREIGN KEY ("planPagamentId") REFERENCES "PlanPagament" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PagamentCategory" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "desc" TEXT,
    "configId" BIGINT NOT NULL,
    CONSTRAINT "PagamentCategory_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PlanPagament" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME,
    "desc" TEXT,
    "recurrent" BOOLEAN NOT NULL,
    "automatic" BOOLEAN NOT NULL,
    "accountId" BIGINT,
    "configId" BIGINT NOT NULL,
    CONSTRAINT "PlanPagament_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "PlanPagament_configId_fkey" FOREIGN KEY ("configId") REFERENCES "Config" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Savings" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" BIGINT NOT NULL,
    "moneyGoal" REAL,
    "finalDate" DATETIME,
    "startDate" DATETIME,
    "removable" BOOLEAN NOT NULL,
    "accountId" BIGINT NOT NULL,
    CONSTRAINT "Savings_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Investments" (
    "id" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "interestRate" REAL NOT NULL,
    "type" TEXT,
    "startDate" DATETIME NOT NULL,
    "accountId" BIGINT NOT NULL,
    CONSTRAINT "Investments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_IncomeToCategory" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,
    CONSTRAINT "_IncomeToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Income" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_IncomeToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "IncomeCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PagamentToCategory" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL,
    CONSTRAINT "_PagamentToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Pagament" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PagamentToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "PagamentCategory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_IncomeToCategory_AB_unique" ON "_IncomeToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_IncomeToCategory_B_index" ON "_IncomeToCategory"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PagamentToCategory_AB_unique" ON "_PagamentToCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_PagamentToCategory_B_index" ON "_PagamentToCategory"("B");
