import { FilterParams } from "@/models/api";

export const tasksKeys = {
  all: ["tasks"] as const,
  list: (filters: FilterParams) => ["tasks", "list", filters] as const,
  detail: (id: number) => ["tasks", id] as const,
};
