import { TaskStatusKey } from "@/models/task";
import Feather from "@expo/vector-icons/Feather";
import { Box, createThemedComponent, Text } from "dripsy";
import { Fragment, useState } from "react";
import { TASK_STATUS_FORMAT } from "../../viewmodels/tasks/constants/tasks";
import { Button } from "../ui/Button";
import { TaskStatusModal } from "./TaskStatusModal";

const Icon = createThemedComponent(Feather);

type TaskStatusSelectProps = {
  value?: TaskStatusKey;
  onChange: (status: TaskStatusKey) => void;
  placeholder?: string;
  title?: string;
};

const styles = {
  trigger: {
    width: "100%",
    height: 56,
    backgroundColor: "$bgTerciary",
    borderRadius: 6,
    padding: "$3",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "$2",
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: "$2",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
} as const;

export const TaskStatusSelect = ({
  value,
  onChange,
  placeholder = "Selecione um status",
  title = "Selecione um status",
}: TaskStatusSelectProps) => {
  const [visible, setVisible] = useState(false);
  const format = value ? TASK_STATUS_FORMAT[value] : undefined;

  const handleSelect = (status: TaskStatusKey) => {
    setVisible(false);
    if (status !== value) onChange(status);
  };

  return (
    <Fragment>
      <Button onPress={() => setVisible(true)} sx={styles.trigger}>
        <Box sx={styles.left}>
          {format ? (
            <Box sx={{ ...styles.dot, backgroundColor: format.color }} />
          ) : null}
          <Text
            variant="paragraph"
            sx={{ color: format ? "$grey" : "$darkGrey" }}
          >
            {format?.name ?? placeholder}
          </Text>
        </Box>
        <Icon name="chevron-down" size={18} sx={{ color: "$darkGrey" }} />
      </Button>

      <TaskStatusModal
        visible={visible}
        status={value}
        title={title}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
      />
    </Fragment>
  );
};
