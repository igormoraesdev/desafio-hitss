import { useCreateTeam } from "@/viewmodels/teams/hooks/useCreateTeam";
import { TeamCreateForm } from "./TeamCreateForm";

export const TeamCreateSection = () => {
  const form = useCreateTeam();

  return <TeamCreateForm {...form} />;
};
