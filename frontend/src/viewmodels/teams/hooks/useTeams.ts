import { PaginationParams } from "@/models/api";
import {
  createTeams,
  deleteTeam,
  findAllTeams,
} from "@/services/teams.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { teamsKeys } from "../constants/teams";

export const useTeams = (initialPagination: PaginationParams = {}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [pagination, setPagination] =
    useState<PaginationParams>(initialPagination);

  const invalidateTeams = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: teamsKeys.all });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: teamsKeys.detail(id) });
    }
  };

  const teamsQuery = useQuery({
    queryKey: teamsKeys.list(pagination),
    queryFn: () => findAllTeams(pagination),
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createTeams,
    onSuccess: () => invalidateTeams(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, id) => invalidateTeams(id),
  });

  const teams = teamsQuery.data?.data ?? [];
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const updatePagination = (next: Partial<PaginationParams>) => {
    setPagination((current) => ({ ...current, ...next }));
  };

  return {
    teams: filteredTeams,
    meta: teamsQuery.data?.meta,
    isLoading: teamsQuery.isPending,
    isFetching: teamsQuery.isFetching,
    error: teamsQuery.error,
    refetch: teamsQuery.refetch,
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    removeTeam: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    search,
    setSearch,
    pagination,
    setPagination: updatePagination,
  };
};
