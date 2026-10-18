import {
  createTeams,
  deleteTeam,
  findAllTeams,
  updateTeam,
} from "@/services/team.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { teamsKeys } from "./constants/teams";

type UpdateTeamVariables = {
  id: number;
  name: string;
  color: string;
};

export const useTeamsViewModel = () => {
  const queryClient = useQueryClient();

  const invalidateTeams = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: teamsKeys.all });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: teamsKeys.detail(id) });
    }
  };

  const teamsQuery = useQuery({
    queryKey: teamsKeys.all,
    queryFn: findAllTeams,
    select: (response) => response.data,
  });

  const createMutation = useMutation({
    mutationFn: createTeams,
    onSuccess: () => invalidateTeams(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...params }: UpdateTeamVariables) =>
      updateTeam(params, id),
    onSuccess: (_, { id }) => invalidateTeams(id),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, id) => invalidateTeams(id),
  });

  return {
    teams: teamsQuery.data ?? [],
    isLoading: teamsQuery.isPending,
    error: teamsQuery.error,
    refetch: teamsQuery.refetch,
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateTeam: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    removeTeam: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
  };
};
