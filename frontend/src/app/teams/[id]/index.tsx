import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TasksSection } from "@/components/tasks/TasksSection";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TeamDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  return (
    <Container
      title="Tarefas"
      description="adicione novas tarefas e separe os itens "
      header={<HeaderButtons leftIcon onLeftPress={router.back} />}
      content={<TasksSection teamId={Number(id)} />}
    />
  );
}
