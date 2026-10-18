import { TaskStatus, TaskStatusKey } from "@/models/task";
import { Box, Flex, Text } from "dripsy";
import { useMemo } from "react";
import { Button } from "../ui/Button";

type TaskButtonProps = {
  teamName: string;
  title: string;
  description: string;
  status: string;
};

const styles = {
  content: {
    maxHeight: 144,
    flex: 1,
    borderRadius: 8,
    padding: "$3",
    backgroundColor: "$bgSecondary",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  row: {
    justifyContent: "space-between",
    width: "100%",
    marginBottom: "$3",
  },
  badge: {
    minWidth: 82,
    maxHeight: 26,
    padding: "$2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
} as const;

export const TaskButton = ({
  title,
  teamName,
  description,
  status,
}: TaskButtonProps) => {
  const statusFormat = useMemo(() => {
    const statusKeys = {
      [TaskStatus.PENDING]: {
        name: "pendente",
        color: "$red",
      },
      [TaskStatus.IN_PROGRESS]: {
        name: "em progresso",
        color: "$orange",
      },
      [TaskStatus.COMPLETED]: {
        name: "concluída",
        color: "$lemon",
      },
    };
    return statusKeys[status as TaskStatusKey];
  }, [status]);

  return (
    <Button sx={styles.content}>
      <Flex sx={styles.row}>
        <Box sx={{ gap: "$2" }}>
          <Text variant="paragraphBold" sx={{ color: "$white" }}>
            {title}
          </Text>
          <Text variant="small" sx={{ color: "$white" }}>
            {teamName}
          </Text>
        </Box>
        <Box sx={{ ...styles.badge, backgroundColor: statusFormat.color }}>
          <Text variant="small" sx={{ color: "$white" }}>
            {statusFormat.name}
          </Text>
        </Box>
      </Flex>
      <Text variant="span" sx={{ color: "$white" }}>
        {description}
      </Text>
    </Button>
  );
};
