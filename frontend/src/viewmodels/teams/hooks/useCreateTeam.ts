import { Teams } from "@/models/team";
import {
  CreateTeamFormSchema,
  createTeamSchema,
} from "@/schemas/teams/team.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useTeams } from "./useTeams";

export const useCreateTeam = (team?: Teams) => {
  const router = useRouter();
  const { createTeam, isCreating } = useTeams();

  const form = useForm<CreateTeamFormSchema>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: team?.name ?? "",
      color: team?.color ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createTeam(values);
    router.back();
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting: isCreating,
    onSubmit,
  };
};
