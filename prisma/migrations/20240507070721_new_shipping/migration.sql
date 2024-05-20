/*
  Warnings:

  - Made the column `address` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Order` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pos` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "pos" SET NOT NULL;
