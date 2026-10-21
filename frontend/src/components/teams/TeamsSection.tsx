import { Teams } from "@/models/team";
import { useTeams } from "@/viewmodels/teams/hooks/useTeams";
import { useRouter } from "expo-router";
import { TeamList } from "./TeamsList";

export const TeamsSection = () => {
  const {
    teams,
    search,
    isLoading,
    isLoadingMore,
    setSearch,
    refetch,
    loadMore,
  } = useTeams();

  const router = useRouter();

  const onTeamPress = (team: Teams) => {
    router.push(`/teams/${String(team.id)}`);
  };

  const onCreatePress = () => {
    router.push("/teams/new");
  };

  const onAllTasksPress = () => {
    router.push("/tasks");
  };

  return (
    <TeamList
      teams={teams}
      search={search}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      refetch={refetch}
      onEndReached={loadMore}
      onSearchChange={setSearch}
      onTeamPress={onTeamPress}
      onCreatePress={onCreatePress}
      onAllTasksPress={onAllTasksPress}
    />
  );
};
