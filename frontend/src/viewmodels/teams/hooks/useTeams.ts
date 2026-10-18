import {
  createTeams,
  deleteTeam,
  findAllTeams,
} from "@/services/teams.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { teamsKeys } from "../constants/teams";

export const useTeams = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

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

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, id) => invalidateTeams(id),
  });

  const teams = teamsQuery.data ?? [];
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return {
    teams: filteredTeams ?? [],
    isLoading: teamsQuery.isPending,
    error: teamsQuery.error,
    refetch: teamsQuery.refetch,
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    removeTeam: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    search,
    setSearch,
  };
};
