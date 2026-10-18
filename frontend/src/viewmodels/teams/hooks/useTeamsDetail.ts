import { findTeamById } from "@/services/teams.service";
import { useQuery } from "@tanstack/react-query";
import { teamsKeys } from "../constants/teams";

export const useTeamsDetail = (id?: number) => {
  const teamQuery = useQuery({
    queryKey: teamsKeys.detail(id ?? 0),
    queryFn: () => findTeamById(id!),
    select: (response) => response.data,
    enabled: id !== undefined,
  });

  return {
    team: teamQuery.data,
    isLoading: teamQuery.isPending,
    error: teamQuery.error,
    refetch: teamQuery.refetch,
  };
};
