import { FilterParams } from "@/models/api";
import { TaskStatus, TaskStatusKey } from "@/models/task";

export type TaskStatusFormat = {
  name: string;
  color: string;
};

export const tasksKeys = {
  all: ["tasks"] as const,
  list: (filters: FilterParams) => ["tasks", "list", filters] as const,
  detail: (id: number) => ["tasks", id] as const,
};

export const TASK_STATUS_FORMAT: Record<TaskStatusKey, TaskStatusFormat> = {
  [TaskStatus.PENDING]: { name: "Pendente", color: "$red" },
  [TaskStatus.IN_PROGRESS]: { name: "Em progresso", color: "$orange" },
  [TaskStatus.COMPLETED]: { name: "Concluída", color: "$lemon" },
};

export const TASK_STATUS_OPTIONS = Object.values(TaskStatus) as TaskStatusKey[];
