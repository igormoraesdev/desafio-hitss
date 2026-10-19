import { Teams } from "@/models/team";
import { CreateTeamFormSchema, createTeamSchema } from "@/schemas/team.schema";
import { createTeams } from "@/services/teams.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { teamsKeys } from "../constants/teams";

export const useCreateTeam = (team?: Teams) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<CreateTeamFormSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: team?.name ?? "",
      color: team?.color ?? "",
    },
  });

  const saveMutation = useMutation({
    mutationFn: createTeams,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamsKeys.all });
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
    onSubmit,
  };
};
