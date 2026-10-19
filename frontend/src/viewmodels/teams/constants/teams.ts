import { PaginationParams } from "@/models/api";

export const teamsKeys = {
  all: ["teams"] as const,
  list: (params: PaginationParams) => ["teams", "list", params] as const,
  detail: (id: number) => ["teams", id] as const,
};
