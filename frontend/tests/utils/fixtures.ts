import { Teams } from "@/models/team";

export const makeTeam = (overrides: Partial<Teams> = {}): Teams => ({
  id: 1,
  name: "Frontend",
  color: "#3B82F6",
  createdAt: "2026-10-16T12:00:00.000Z",
  ...overrides,
});
