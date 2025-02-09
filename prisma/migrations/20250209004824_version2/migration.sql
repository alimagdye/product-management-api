/*
  Warnings:

  - You are about to drop the `UpdatePoint` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `description` to the `Update` table without a default value. This is not possible if the table is not empty.
  - Made the column `version` on table `Update` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "UpdatePoint" DROP CONSTRAINT "UpdatePoint_updateId_fkey";

-- AlterTable
ALTER TABLE "Update" ADD COLUMN     "description" TEXT NOT NULL,
ALTER COLUMN "version" SET NOT NULL;

-- DropTable
DROP TABLE "UpdatePoint";
