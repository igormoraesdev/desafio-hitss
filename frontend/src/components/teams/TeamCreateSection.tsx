import { Teams } from "@/models/team";
import { useCreateTeam } from "@/viewmodels/teams/hooks/useCreateTeam";
import { TeamCreateForm } from "./TeamCreateForm";

type TeamCreateSectionProps = {
  team?: Teams;
};

export const TeamCreateSection = ({ team }: TeamCreateSectionProps = {}) => {
  const form = useCreateTeam(team);

  return <TeamCreateForm {...form} />;
};
