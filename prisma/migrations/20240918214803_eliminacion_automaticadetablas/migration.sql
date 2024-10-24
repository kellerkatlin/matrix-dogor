-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "probability" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Event_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Event" ("id", "impact", "matrixId", "name", "probability", "riskLevel", "value") SELECT "id", "impact", "matrixId", "name", "probability", "riskLevel", "value" FROM "Event";
DROP TABLE "Event";
ALTER TABLE "new_Event" RENAME TO "Event";
CREATE TABLE "new_Impact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Impact_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Impact" ("id", "matrixId", "value") SELECT "id", "matrixId", "value" FROM "Impact";
DROP TABLE "Impact";
ALTER TABLE "new_Impact" RENAME TO "Impact";
CREATE TABLE "new_Probability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Probability_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Probability" ("id", "matrixId", "value") SELECT "id", "matrixId", "value" FROM "Probability";
DROP TABLE "Probability";
ALTER TABLE "new_Probability" RENAME TO "Probability";
CREATE TABLE "new_RiskLevel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "color" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "RiskLevel_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_RiskLevel" ("color", "id", "label", "matrixId", "max", "min") SELECT "color", "id", "label", "matrixId", "max", "min" FROM "RiskLevel";
DROP TABLE "RiskLevel";
ALTER TABLE "new_RiskLevel" RENAME TO "RiskLevel";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
