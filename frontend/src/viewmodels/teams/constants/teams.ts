import { TeamFilterParams } from "@/models/api";

export const teamsKeys = {
  all: ["teams"] as const,
  list: (params: TeamFilterParams) => ["teams", "list", params] as const,
  detail: (id: number) => ["teams", id] as const,
};
