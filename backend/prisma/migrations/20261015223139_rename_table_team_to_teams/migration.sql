-- Rename table "team" to "teams" preserving data
ALTER TABLE "team" RENAME TO "teams";

-- Rename primary key and unique index to follow the new table name
ALTER TABLE "teams" RENAME CONSTRAINT "team_pkey" TO "teams_pkey";
ALTER INDEX "team_name_key" RENAME TO "teams_name_key";
