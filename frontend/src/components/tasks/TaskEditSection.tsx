import { theme } from "@/styles/theme";
import { useTaskDetail } from "@/viewmodels/tasks/hooks/useTaskDetail";
import { Box, Text } from "dripsy";
import { ActivityIndicator } from "react-native";
import { TaskCreateSection } from "./TaskCreateSection";

type TaskEditSectionProps = {
  id: number;
};

const styles = {
  feedback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: "$2",
  },
} as const;

export const TaskEditSection = ({ id }: TaskEditSectionProps) => {
  const { task, isLoading, error } = useTaskDetail(id);

  if (isLoading) {
    return (
      <Box sx={styles.feedback}>
        <ActivityIndicator color={theme.colors.$green} />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Box sx={styles.feedback}>
        <Text variant="paragraph" sx={{ color: "$darkGrey" }}>
          Não foi possível carregar a tarefa
        </Text>
      </Box>
    );
  }

  return <TaskCreateSection task={task} />;
};
