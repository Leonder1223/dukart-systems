-- CreateTable
CREATE TABLE "TestEntry" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestEntry_pkey" PRIMARY KEY ("id")
);
