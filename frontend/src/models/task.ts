import { Teams } from "./team";

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export type TaskStatusKey = keyof typeof TaskStatus;

export type Tasks = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatusKey;
  teams: Teams[];
  createdAt: string;
};
