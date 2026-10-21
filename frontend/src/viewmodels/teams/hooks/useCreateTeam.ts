import { Teams } from "@/models/team";
import { CreateTeamFormSchema, createTeamSchema } from "@/schemas/team.schema";
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

  const onSubmit = form.handleSubmit(async (values) => {
    await saveMutation.mutateAsync(values);
    router.back();
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting: saveMutation.isPending,
    isEdit,
    onSubmit,
  };
};
