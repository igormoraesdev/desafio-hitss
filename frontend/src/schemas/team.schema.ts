import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do time")
    .max(50, "O nome pode ter no máximo 50 caracteres"),
  color: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Escolha uma cor"),
});

export type CreateTeamFormSchema = z.infer<typeof createTeamSchema>;
