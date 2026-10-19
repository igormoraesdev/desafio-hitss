import { TaskStatusKey } from "@/models/task";
import { theme } from "@/styles/theme";
import Feather from "@expo/vector-icons/Feather";
import { Box, createThemedComponent, styled, Text } from "dripsy";
import { Modal, Pressable } from "react-native";
import {
  TASK_STATUS_FORMAT,
  TASK_STATUS_OPTIONS,
} from "../../viewmodels/tasks/constants/tasks";

const CheckIcon = createThemedComponent(Feather);
const StyledOverlay = styled(Pressable)();
const StyledMenu = styled(Pressable)();
const StyledOption = styled(Pressable)();

type TaskStatusModalProps = {
  visible: boolean;
  status?: TaskStatusKey;
  title?: string;
  onClose: () => void;
  onSelect: (status: TaskStatusKey) => void;
};

const styles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  menu: {
    backgroundColor: "$bgTerciary",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: "$4",
    gap: "$2",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: "$3",
    paddingHorizontal: "$3",
    borderRadius: 6,
  },
  optionLeft: {
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

export const TaskStatusModal = ({
  visible,
  status,
  title = "Alterar status",
  onClose,
  onSelect,
}: TaskStatusModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StyledOverlay onPress={onClose} sx={styles.overlay}>
        <StyledMenu onPress={(e) => e.stopPropagation()} sx={styles.menu}>
          <Text variant="h2" sx={{ color: "$white", marginBottom: "$2" }}>
            {title}
          </Text>
          {TASK_STATUS_OPTIONS.map((option) => {
            const format = TASK_STATUS_FORMAT[option];
            const isSelected = option === status;
            return (
              <StyledOption
                key={option}
                onPress={() => onSelect(option)}
                sx={styles.option}
                style={({ pressed }) => ({
                  backgroundColor: pressed
                    ? theme.colors.$bgSecondary
                    : "transparent",
                })}
              >
                <Box sx={styles.optionLeft}>
                  <Box sx={{ ...styles.dot, backgroundColor: format.color }} />
                  <Text
                    variant="paragraph"
                    sx={{ color: isSelected ? "$white" : "$grey" }}
                  >
                    {format.name}
                  </Text>
                </Box>
                {isSelected ? (
                  <CheckIcon
                    name="check"
                    size={18}
                    sx={{ color: "$lighGreen" }}
                  />
                ) : null}
              </StyledOption>
            );
          })}
        </StyledMenu>
      </StyledOverlay>
    </Modal>
  );
};
