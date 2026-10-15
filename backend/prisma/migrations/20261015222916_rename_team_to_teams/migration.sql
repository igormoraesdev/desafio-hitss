/*
  Warnings:

  - You are about to drop the column `teamId` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the `_TasksToTeam` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_TasksToTeam" DROP CONSTRAINT "_TasksToTeam_A_fkey";

-- DropForeignKey
ALTER TABLE "_TasksToTeam" DROP CONSTRAINT "_TasksToTeam_B_fkey";

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "teamId";

-- DropTable
DROP TABLE "_TasksToTeam";

-- CreateTable
CREATE TABLE "_TasksToTeams" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TasksToTeams_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TasksToTeams_B_index" ON "_TasksToTeams"("B");

-- AddForeignKey
ALTER TABLE "_TasksToTeams" ADD CONSTRAINT "_TasksToTeams_A_fkey" FOREIGN KEY ("A") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TasksToTeams" ADD CONSTRAINT "_TasksToTeams_B_fkey" FOREIGN KEY ("B") REFERENCES "team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
