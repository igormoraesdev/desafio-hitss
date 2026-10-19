import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TaskEditSection } from "@/components/tasks/TaskEditSection";
import { useTaskDetail } from "@/viewmodels/tasks/hooks/useTaskDetail";
import AntDesign from "@expo/vector-icons/AntDesign";
import { createThemedComponent } from "dripsy";
import { useLocalSearchParams, useRouter } from "expo-router";

const CheckIcon = createThemedComponent(AntDesign);

export default function TaskDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const taskId = Number(id);
  const { onDeletePress } = useTaskDetail(taskId);

  return (
    <Container
      title="Editar tarefa"
      description="altere os dados da tarefa"
      spaceTitleContent={100}
      header={
        <HeaderButtons
          leftIcon
          rightIcon
          onLeftPress={router.back}
          onRightPress={onDeletePress}
        />
      }
      titleIcon={
        <CheckIcon name="check-square" size={56} sx={{ color: "$green" }} />
      }
      content={<TaskEditSection id={taskId} />}
    />
  );
}
