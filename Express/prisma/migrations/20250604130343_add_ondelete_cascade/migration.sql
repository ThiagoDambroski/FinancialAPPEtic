-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Config" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "can_modify_date" BOOLEAN NOT NULL,
    "can_account_go_bellow_zero" BOOLEAN NOT NULL,
    "put_change_current_value" BOOLEAN NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Config_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Config" ("can_account_go_bellow_zero", "can_modify_date", "id", "put_change_current_value", "userId") SELECT "can_account_go_bellow_zero", "can_modify_date", "id", "put_change_current_value", "userId" FROM "Config";
DROP TABLE "Config";
ALTER TABLE "new_Config" RENAME TO "Config";
CREATE UNIQUE INDEX "Config_userId_key" ON "Config"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
