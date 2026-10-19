import { FilterParams } from "@/models/api";
import {
  createTasks,
  deleteTask,
  findAllTasks,
} from "@/services/tasks.service";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { tasksKeys } from "../constants/tasks";

type TaskFilters = Omit<FilterParams, "search">;

export const useTasks = (initialFilters: TaskFilters = {}) => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<TaskFilters>(initialFilters);

  const params: FilterParams = {
    ...filters,
    search: search.trim() || undefined,
  };

  const invalidateTasks = (id?: number) => {
    queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    if (id !== undefined) {
      queryClient.invalidateQueries({ queryKey: tasksKeys.detail(id) });
    }
  };

  const tasksQuery = useQuery({
    queryKey: tasksKeys.list(params),
    queryFn: () => findAllTasks(params),
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

  return {
    tasks: tasksQuery.data?.data ?? [],
    meta: tasksQuery.data?.meta,
    isLoading: tasksQuery.isPending,
    isFetching: tasksQuery.isFetching,
    error: tasksQuery.error,
    refetch: tasksQuery.refetch,
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
