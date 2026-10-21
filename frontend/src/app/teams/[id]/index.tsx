import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TasksSection } from "@/components/tasks/TasksSection";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TeamDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = Number(id);

  const onEditPress = () => {
    router.push(`/teams/${String(teamId)}/edit`);
  };

  return (
    <Container
      title="Tarefas"
      description="adicione novas tarefas e separe os itens "
      header={
        <HeaderButtons
          leftIcon
          editIcon
          onLeftPress={router.back}
          onEditPress={onEditPress}
        />
      }
      content={<TasksSection teamId={teamId} />}
    />
  );
}
