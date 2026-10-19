import { ApiResponse, FilterParams } from "@/models/api";
import { Tasks, TaskStatusKey } from "@/models/task";
import {
  createTasks,
  deleteTask,
  findAllTasks,
  updateTask,
} from "@/services/tasks.service";
import {
  InfiniteData,
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

type TasksPages = InfiniteData<ApiResponse<Tasks[]>>;

type UpdateStatusVariables = { id: number; status: TaskStatusKey };

const patchTaskStatus = (
  pages: TasksPages | undefined,
  { id, status }: UpdateStatusVariables,
): TasksPages | undefined => {
  if (!pages) return pages;
  return {
    ...pages,
    pages: pages.pages.map((page) => ({
      ...page,
      data: page.data.map((task) =>
        task.id === id ? { ...task, status } : task,
      ),
    })),
  };
};

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

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: UpdateStatusVariables) =>
      updateTask(id, { status }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: tasksKeys.all });
      const snapshot = queryClient.getQueriesData<TasksPages>({
        queryKey: tasksKeys.all,
      });
      queryClient.setQueriesData<TasksPages>(
        { queryKey: tasksKeys.all },
        (pages) => patchTaskStatus(pages, variables),
      );
      return { snapshot };
    },
    onError: (_, __, context) => {
      context?.snapshot.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: (_, __, { id }) => invalidateTasks(id),
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
    updateStatus: updateStatusMutation.mutateAsync,
    updatingTaskId: updateStatusMutation.isPending
      ? updateStatusMutation.variables.id
      : undefined,
    removeTask: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    search,
    setSearch,
    filters,
    setFilters: updateFilters,
  };
};
