import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TasksSection } from "@/components/tasks/TasksSection";
import { useRouter } from "expo-router";

export default function AllTasksScreen() {
  const router = useRouter();

  return (
    <Container
      title="Todas as tarefas"
      description="tarefas de todos os times"
      header={<HeaderButtons leftIcon onLeftPress={router.back} />}
      content={<TasksSection />}
    />
  );
}
