export const teamsKeys = {
  all: ["teams"] as const,
  detail: (id: number) => ["teams", id] as const,
};
