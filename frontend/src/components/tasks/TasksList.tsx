import { Tasks } from "@/models/task";
import { Teams } from "@/models/team";
import { ActivityIndicator, Box, styled, Sx } from "dripsy";
import { useState } from "react";
import { FlatList, FlatListProps, Platform } from "react-native";
import { EmptyState } from "../layout/EmptyState";
import { TaskButton } from "../layout/TaskButton";
import { TaskButtonSkeleton } from "../layout/TaskButtonSkeleton";
import { Button } from "../ui/Button";
import { TaskFilterValues, TasksFilters } from "./TasksFilters";

const DripsyFlatList = styled(FlatList)() as <T>(
  props: FlatListProps<T> & { sx?: Sx },
) => React.ReactElement;

type TasksListProps = {
  team: Teams;
  tasks: Tasks[];
  search: string;
  filters: TaskFilterValues;
  isLoading: boolean;
  isLoadingMore?: boolean;
  refetch?: () => Promise<unknown>;
  onEndReached?: () => void;
  onSearchChange: (text: string) => void;
  onFiltersChange: (filters: TaskFilterValues) => void;
  onTaskPress: (task: Tasks) => void;
  onCreatePress?: () => void;
};

const styles = {
  content: {
    flex: 1,
    width: "100%",
    gap: "$3",
    marginTop: "$5",
    paddingBottom: Platform.select({ android: "$5", ios: undefined }),
  },
  skeletons: {
    flex: 1,
    gap: "$3",
  },
  footer: {
    paddingVertical: "$3",
    alignItems: "center",
  },
} as const;

export const TasksList = ({
  team,
  tasks,
  search,
  filters,
  isLoading,
  isLoadingMore,
  refetch,
  onEndReached,
  onSearchChange,
  onFiltersChange,
  onTaskPress,
  onCreatePress,
}: TasksListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!refetch) return;
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Box sx={styles.content}>
      <TasksFilters
        search={search}
        filters={filters}
        onSearchChange={onSearchChange}
        onFiltersChange={onFiltersChange}
      />
      {isLoading ? (
        <Box sx={styles.skeletons}>
          <TaskButtonSkeleton />
          <TaskButtonSkeleton />
          <TaskButtonSkeleton />
        </Box>
      ) : (
        <DripsyFlatList
          sx={{ flex: 1 }}
          data={tasks}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskButton
              title={item.title}
              description={item.description}
              teamName={team.name}
              status={item.status}
              onPress={() => onTaskPress(item)}
            />
          )}
          ListEmptyComponent={<EmptyState isTeam={false} search={search} />}
          ListFooterComponent={
            isLoadingMore ? (
              <Box sx={styles.footer}>
                <ActivityIndicator color="#00875F" />
              </Box>
            ) : null
          }
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{ gap: 16, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
        />
      )}
      <Button onPress={onCreatePress}>Nova tarefa</Button>
    </Box>
  );
};
