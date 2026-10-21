import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TasksSection } from "@/components/tasks/TasksSection";
import { useTeamsDetail } from "@/viewmodels/teams/hooks/useTeamsDetail";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TeamDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const teamId = Number(id);
  const { onDeletePress } = useTeamsDetail(teamId);

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
          rightIcon
          onLeftPress={router.back}
          onEditPress={onEditPress}
          onRightPress={onDeletePress}
        />
      }
      content={<TasksSection teamId={teamId} />}
    />
  );
}
