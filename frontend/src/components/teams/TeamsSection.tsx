import { Teams } from "@/models/team";
import { useTeams } from "@/viewmodels/teams/hooks/useTeams";
import { useRouter } from "expo-router";
import { TeamList } from "./TeamsList";

export const TeamsSection = () => {
  const { teams, search, isLoading, setSearch, refetch } = useTeams();

  const router = useRouter();

  const onTeamPress = (team: Teams) => {
    router.push(`/teams/${String(team.id)}`);
  };

  const onCreatePress = () => {
    router.push("/teams/new");
  };

  return (
    <TeamList
      teams={teams}
      search={search}
      isLoading={isLoading}
      refetch={refetch}
      onSearchChange={setSearch}
      onTeamPress={onTeamPress}
      onCreatePress={onCreatePress}
    />
  );
};
