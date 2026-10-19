import { FilterParams } from "@/models/api";
import {
  createTasks,
  deleteTask,
  findAllTasks,
} from "@/services/tasks.service";
import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { tasksKeys } from "../constants/tasks";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 300;

type TaskFilters = Omit<FilterParams, "search" | "page">;

export const useTasks = (initialFilters: TaskFilters = {}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilters>({
    limit: PAGE_SIZE,
    sortBy: "createdAt",
    order: "desc",
    ...initialFilters,
  });

  useEffect(() => {
    const timeout = setTimeout(
      () => setDebouncedSearch(search.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timeout);
  }, [search]);

  const params: FilterParams = {
    ...filters,
    search: debouncedSearch || undefined,
  };

  const invalidateTasks = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
    }
  };

  const tasksQuery = useInfiniteQuery({
    queryKey: tasksKeys.list(params),
    queryFn: ({ pageParam }) => findAllTasks({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const meta = lastPage.meta;
      if (!meta || meta.page >= meta.totalPages) return undefined;
      return meta.page + 1;
    },
    placeholderData: keepPreviousData,
  });

  const createMutation = useMutation({
    mutationFn: createTasks,
    onSuccess: () => invalidateTasks(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, id) => invalidateTasks(id),
  });

  const updateFilters = (next: Partial<TaskFilters>) => {
    setFilters((current) => ({ ...current, ...next }));
  };

  const loadMore = () => {
    if (tasksQuery.hasNextPage && !tasksQuery.isFetchingNextPage) {
      tasksQuery.fetchNextPage();
    }
  };

  return {
    tasks: tasksQuery.data?.pages.flatMap((page) => page.data) ?? [],
    total: tasksQuery.data?.pages.at(-1)?.meta?.total ?? 0,
    isLoading: tasksQuery.isPending,
    isFetching: tasksQuery.isFetching,
    isLoadingMore: tasksQuery.isFetchingNextPage,
    hasMore: tasksQuery.hasNextPage,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
    loadMore,
    createTask: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    removeTask: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    search,
    setSearch,
    filters,
    setFilters: updateFilters,
  };
};
