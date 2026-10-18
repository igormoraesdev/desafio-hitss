import { Teams } from "./team";

export enum TaskStatus {
  PENDING,
  IN_PROGRESS,
  COMPLETED,
}

export type TaskStatusKey = keyof typeof TaskStatus;

export type Tasks = {
  title: string;
  description: string;
  status: TaskStatusKey;
  teams: Teams[];
  createdAt: string;
};
