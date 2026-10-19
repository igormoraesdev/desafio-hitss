import { useCreateTask } from "@/viewmodels/tasks/hooks/useCreateTask";
import { useTeams } from "@/viewmodels/teams/hooks/useTeams";
import { TaskCreateForm } from "./TaskCreateForm";

export const TaskCreateSection = () => {
  const form = useCreateTask();
  const { teams, isLoading, isLoadingMore, loadMore } = useTeams();

  return (
    <TaskCreateForm
      {...form}
      teams={teams}
      isLoadingTeams={isLoading}
      isLoadingMoreTeams={isLoadingMore}
      onLoadMoreTeams={loadMore}
    />
  );
};
