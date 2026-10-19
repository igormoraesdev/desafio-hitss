import {
  createTeams,
  deleteTeam,
  findAllTeams,
} from "@/services/teams.service";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { teamsKeys } from "../constants/teams";

const PAGE_SIZE = 10;

export const useTeams = (limit = PAGE_SIZE) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const invalidateTeams = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: teamsKeys.all });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: teamsKeys.detail(id) });
    }
  };

  const teamsQuery = useInfiniteQuery({
    queryKey: teamsKeys.list({ limit }),
    queryFn: ({ pageParam }) => findAllTeams({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta || meta.page >= meta.totalPages) return undefined;
      return meta.page + 1;
    },
  });

  const createMutation = useMutation({
    mutationFn: createTeams,
    onSuccess: () => invalidateTeams(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, id) => invalidateTeams(id),
  });

  const teams = teamsQuery.data?.pages.flatMap((page) => page.data) ?? [];
  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const loadMore = () => {
    if (teamsQuery.hasNextPage && !teamsQuery.isFetchingNextPage) {
      teamsQuery.fetchNextPage();
    }
  };

  return {
    teams: filteredTeams,
    total: teamsQuery.data?.pages.at(-1)?.meta?.total ?? 0,
    isLoading: teamsQuery.isPending,
    isFetching: teamsQuery.isFetching,
    isLoadingMore: teamsQuery.isFetchingNextPage,
    hasMore: teamsQuery.hasNextPage,
    error: teamsQuery.error,
    refetch: teamsQuery.refetch,
    loadMore,
    createTeam: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    removeTeam: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    search,
    setSearch,
  };
};
