-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserCart" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "UserCart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "UserCart_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UserCart" ("count", "created_at", "id", "product_id", "updated_at", "user_id") SELECT "count", "created_at", "id", "product_id", "updated_at", "user_id" FROM "UserCart";
DROP TABLE "UserCart";
ALTER TABLE "new_UserCart" RENAME TO "UserCart";
CREATE UNIQUE INDEX "UserCart_user_id_product_id_key" ON "UserCart"("user_id", "product_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
