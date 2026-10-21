import { Tasks, TaskStatusKey } from "@/models/task";
import { useTasks } from "@/viewmodels/tasks/hooks/useTasks";
import { useRouter } from "expo-router";
import { TaskFilterValues } from "./TasksFilters";
import { TasksList } from "./TasksList";

type TasksSectionProps = {
  teamId: number;
};

export const TasksSection = ({ teamId }: TasksSectionProps) => {
  const router = useRouter();
  const {
    tasks,
    search,
    isLoading,
    isLoadingMore,
    filters,
    setSearch,
    setFilters,
    refetch,
    loadMore,
    updateStatus,
    updatingTaskId,
  } = useTasks({ teamId });

  const onChangeStatus = async (task: Tasks, status: TaskStatusKey) => {
    try {
      await updateStatus({ id: task.id, status });
    } catch (error) {
      console.warn("Falha ao atualizar o status da tarefa", error);
    }
  };

  const onFiltersChange = (next: TaskFilterValues) => {
    setFilters(next);
  };

  const onTaskPress = (task: Tasks) => {
    router.push(`/tasks/${String(task.id)}`);
  };

  const onCreatePress = () => {
    router.push("/tasks/new");
  };

  return (
    <TasksList
      tasks={tasks}
      search={search}
      filters={{
        status: filters.status,
        sortBy: filters.sortBy,
        order: filters.order,
      }}
      isLoading={isLoading}
      isLoadingMore={isLoadingMore}
      refetch={refetch}
      onEndReached={loadMore}
      onSearchChange={setSearch}
      onFiltersChange={onFiltersChange}
      onTaskPress={onTaskPress}
      onChangeStatus={onChangeStatus}
      updatingTaskId={updatingTaskId}
      onCreatePress={onCreatePress}
    />
  );
};
