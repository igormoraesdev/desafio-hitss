import { Teams } from "@/models/team";
import { CreateTeamFormSchema, createTeamSchema } from "@/schemas/team.schema";
import { getApiErrorMessage } from "@/services/api";
import { createTeams, updateTeam } from "@/services/teams.service";
import { tasksKeys } from "@/viewmodels/tasks/constants/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { teamsKeys } from "../constants/teams";

export const useCreateTeam = (team?: Teams) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = team !== undefined;

  const form = useForm<CreateTeamFormSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: team?.name ?? "",
      color: team?.color ?? "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values: CreateTeamFormSchema) =>
      team ? updateTeam(team.id, values) : createTeams(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamsKeys.all });
      if (team) {
        queryClient.invalidateQueries({ queryKey: teamsKeys.detail(team.id) });
        queryClient.invalidateQueries({ queryKey: tasksKeys.all });
      }
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    saveMutation.mutate(values, { onSuccess: () => router.back() });
  });

  const apiError = saveMutation.error
    ? getApiErrorMessage(
        saveMutation.error,
        isEdit
          ? "Não foi possível salvar o time"
          : "Não foi possível criar o time",
      )
    : undefined;

  return {
    control: form.control,
    errors: form.formState.errors,
    apiError,
    isSubmitting: saveMutation.isPending,
    isEdit,
    onSubmit,
  };
};
