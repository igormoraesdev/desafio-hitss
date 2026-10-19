import { Teams } from "@/models/team";
import { theme } from "@/styles/theme";
import Feather from "@expo/vector-icons/Feather";
import { Box, createThemedComponent, styled, Text } from "dripsy";
import { Fragment, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Modal,
  Pressable,
} from "react-native";
import { Button } from "../ui/Button";

const Icon = createThemedComponent(Feather);
const StyledOverlay = styled(Pressable)();
const StyledContent = styled(Pressable)();
const StyledOption = styled(Pressable)();

type TeamsSelectProps = {
  teams: Teams[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onEndReached?: () => void;
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
  triggerText: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "$bgTerciary",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: "$4",
    gap: "$3",
    maxHeight: "60%",
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
  empty: {
    paddingVertical: "$4",
    alignItems: "center",
  },
} as const;

export const TeamsSelect = ({
  teams,
  selectedIds,
  onChange,
  isLoading,
  isLoadingMore,
  onEndReached,
  placeholder = "Selecione os times",
  title = "Selecione os times",
}: TeamsSelectProps) => {
  const [visible, setVisible] = useState(false);

  const selectedTeams = teams.filter((team) => selectedIds.includes(team.id));
  const label = selectedTeams.map((team) => team.name).join(", ");

  const handlePress = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((item) => item !== id)
      : [...selectedIds, id];
    onChange(next);
  };

  const close = () => setVisible(false);

  const renderItem: ListRenderItem<Teams> = ({ item }) => {
    const isSelected = selectedIds.includes(item.id);
    return (
      <StyledOption
        onPress={() => handlePress(item.id)}
        sx={styles.option}
        style={({ pressed }) => ({
          backgroundColor: pressed ? theme.colors.$bgSecondary : "transparent",
        })}
      >
        <Box sx={styles.optionLeft}>
          <Box sx={{ ...styles.dot, backgroundColor: item.color }} />
          <Text
            variant="paragraph"
            sx={{ color: isSelected ? "$white" : "$grey" }}
          >
            {item.name}
          </Text>
        </Box>
        {isSelected ? (
          <Icon name="check" size={18} sx={{ color: "$lighGreen" }} />
        ) : null}
      </StyledOption>
    );
  };

  return (
    <Fragment>
      <Button onPress={() => setVisible(true)} sx={styles.trigger}>
        <Text
          variant="paragraph"
          numberOfLines={1}
          sx={{ ...styles.triggerText, color: label ? "$grey" : "$darkGrey" }}
        >
          {label || placeholder}
        </Text>
        <Icon name="chevron-down" size={18} sx={{ color: "$darkGrey" }} />
      </Button>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <StyledOverlay onPress={close} sx={styles.overlay}>
          <StyledContent
            onPress={(e) => e.stopPropagation()}
            sx={styles.content}
          >
            <Text variant="h2" sx={{ color: "$white" }}>
              {title}
            </Text>
            {isLoading ? (
              <Box sx={styles.empty}>
                <ActivityIndicator color="#00B37E" />
              </Box>
            ) : (
              <FlatList
                data={teams}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
                ListEmptyComponent={
                  <Box sx={styles.empty}>
                    <Text variant="paragraph" sx={{ color: "$darkGrey" }}>
                      Nenhum time encontrado
                    </Text>
                  </Box>
                }
                ListFooterComponent={
                  isLoadingMore ? (
                    <Box sx={styles.empty}>
                      <ActivityIndicator color={theme.colors.$green} />
                    </Box>
                  ) : null
                }
              />
            )}
            <Button onPress={close}>Concluir</Button>
          </StyledContent>
        </StyledOverlay>
      </Modal>
    </Fragment>
  );
};
