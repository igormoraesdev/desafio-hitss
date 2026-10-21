import { TaskStatusKey } from "@/models/task";
import { Teams } from "@/models/team";
import Feather from "@expo/vector-icons/Feather";
import { Box, createThemedComponent, Flex, Text } from "dripsy";
import { Fragment, useState } from "react";
import { ActivityIndicator, Platform } from "react-native";
import { TaskStatusModal } from "./TaskStatusModal";

import { TASK_STATUS_FORMAT } from "@/viewmodels/tasks/constants/tasks";
import { TeamChip } from "../teams/TeamChip";
import { Button } from "../ui/Button";

const MenuIcon = createThemedComponent(Feather);

type TaskTeam = Pick<Teams, "id" | "name" | "color">;

type TaskButtonProps = {
  teams: TaskTeam[];
  title: string;
  description?: string | null;
  status: TaskStatusKey;
  isUpdating?: boolean;
  onPress?: () => void;
  onChangeStatus?: (status: TaskStatusKey) => void;
};

const styles = {
  content: {
    minHeight: 144,
    flex: 1,
    borderRadius: 8,
    padding: "$3",
    backgroundColor: "$bgSecondary",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  row: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    marginBottom: "$3",
  },
  teams: {
    flexWrap: "wrap",
    gap: "$1",
  },
  right: {
    alignItems: "center",
    gap: "$1",
  },
  badge: {
    minWidth: 82,
    height: Platform.select({ android: 30, ios: 26 }),
    paddingHorizontal: "$2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
} as const;

export const TaskButton = ({
  title,
  teams,
  description,
  status,
  isUpdating = false,
  onPress,
  onChangeStatus,
}: TaskButtonProps) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const format = TASK_STATUS_FORMAT[status];

  const handleSelect = (next: TaskStatusKey) => {
    setMenuVisible(false);
    if (next !== status) {
      onChangeStatus?.(next);
    }
  };

  return (
    <Fragment>
      <Button sx={styles.content} onPress={onPress}>
        <Flex sx={styles.row}>
          <Box sx={{ gap: "$2", flex: 1 }}>
            <Text variant="paragraphBold" sx={{ color: "$white" }}>
              {title}
            </Text>
            {teams.length > 0 ? (
              <Flex sx={styles.teams}>
                {teams.map((team) => (
                  <TeamChip key={team.id} name={team.name} color={team.color} />
                ))}
              </Flex>
            ) : (
              <Text variant="small" sx={{ color: "$darkGrey" }}>
                Sem time
              </Text>
            )}
          </Box>
          <Flex sx={styles.right}>
            <Box sx={{ ...styles.badge, backgroundColor: format.color }}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text variant="small" sx={{ color: "$white" }}>
                  {format.name}
                </Text>
              )}
            </Box>
            {onChangeStatus ? (
              <Button
                hasStyle={false}
                disabled={isUpdating}
                onPress={() => setMenuVisible(true)}
              >
                <MenuIcon
                  name="more-vertical"
                  size={20}
                  sx={{ color: "$grey" }}
                />
              </Button>
            ) : null}
          </Flex>
        </Flex>
        <Text variant="span" sx={{ color: "$white" }}>
          {description ?? ""}
        </Text>
      </Button>

      {onChangeStatus ? (
        <TaskStatusModal
          visible={menuVisible}
          status={status}
          onClose={() => setMenuVisible(false)}
          onSelect={handleSelect}
        />
      ) : null}
    </Fragment>
  );
};
