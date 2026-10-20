import { TaskStatus, TaskStatusKey } from "@/models/task";
import { z } from "zod";

const TASK_STATUS_KEYS = Object.keys(TaskStatus) as [TaskStatusKey];

export const createTaskSchema = z.object({
  title: z
    .string("Informe o título da tarefa")
    .trim()
    .min(1, "Informe o título da tarefa")
    .max(100, "O título pode ter no máximo 100 caracteres"),
  description: z
    .string()
    .trim()
    .max(500, "A descrição pode ter no máximo 500 caracteres")
    .optional(),
  status: z.enum(TASK_STATUS_KEYS, "Escolha um status"),
  teamIds: z
    .array(z.number().int().positive(), "Selecione ao menos um time")
    .min(1, "Selecione ao menos um time"),
});

export type CreateTaskFormInput = z.input<typeof createTaskSchema>;
export type CreateTaskFormSchema = z.output<typeof createTaskSchema>;
