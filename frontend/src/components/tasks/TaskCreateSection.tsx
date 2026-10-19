import { Tasks } from "@/models/task";
import { useCreateTask } from "@/viewmodels/tasks/hooks/useCreateTask";
import { useTeams } from "@/viewmodels/teams/hooks/useTeams";
import { TaskCreateForm } from "./TaskCreateForm";

type TaskCreateSectionProps = {
  task?: Tasks;
};

export const TaskCreateSection = ({ task }: TaskCreateSectionProps) => {
  const form = useCreateTask(task);
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
