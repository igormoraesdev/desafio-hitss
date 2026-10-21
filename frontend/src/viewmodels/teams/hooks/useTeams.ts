import { TeamFilterParams } from "@/models/api";
import { findAllTeams } from "@/services/teams.service";
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { teamsKeys } from "../constants/teams";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

export const useTeams = (limit = PAGE_SIZE) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const params: TeamFilterParams = {
    limit,
    search: debouncedSearch || undefined,
  };

  const teamsQuery = useInfiniteQuery({
    queryKey: teamsKeys.list(params),
    queryFn: ({ pageParam }) => findAllTeams({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta || meta.page >= meta.totalPages) return undefined;
      return meta.page + 1;
    },
    placeholderData: keepPreviousData,
  });

  const loadMore = () => {
    if (teamsQuery.hasNextPage && !teamsQuery.isFetchingNextPage) {
      teamsQuery.fetchNextPage();
    }
  };

  return {
    teams: teamsQuery.data?.pages.flatMap((page) => page.data) ?? [],
    isLoading: teamsQuery.isPending,
    isLoadingMore: teamsQuery.isFetchingNextPage,
    error: teamsQuery.error,
    refetch: teamsQuery.refetch,
    loadMore,
    search,
    setSearch,
  };
};
