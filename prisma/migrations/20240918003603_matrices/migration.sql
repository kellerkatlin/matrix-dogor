-- CreateTable
CREATE TABLE "Matrix" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Matrix_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RiskLevel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "color" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "min" INTEGER NOT NULL,
    "max" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "RiskLevel_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Event" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "probability" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "value" INTEGER NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Event_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Probability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Probability_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Impact" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" INTEGER NOT NULL,
    "matrixId" INTEGER NOT NULL,
    CONSTRAINT "Impact_matrixId_fkey" FOREIGN KEY ("matrixId") REFERENCES "Matrix" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
