import { Teams } from "@/models/team";
import { Box, styled, Sx } from "dripsy";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  FlatListProps,
  Platform,
} from "react-native";
import { EmptyState } from "../layout/EmptyState";
import { TeamButton } from "./TeamButton";
import { TeamButtonSkeleton } from "./TeamButtonSkeleton";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const DripsyFlatList = styled(FlatList)() as <T>(
  props: FlatListProps<T> & { sx?: Sx },
) => React.ReactElement;

type TeamListProps = {
  teams: Teams[];
  search: string;
  isLoading: boolean;
  isLoadingMore?: boolean;
  refetch?: () => Promise<unknown>;
  onEndReached?: () => void;
  onSearchChange: (text: string) => void;
  onTeamPress: (team: Teams) => void;
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

export const TeamList = ({
  teams,
  search,
  isLoading,
  isLoadingMore = false,
  refetch,
  onEndReached,
  onSearchChange,
  onTeamPress,
  onCreatePress,
}: TeamListProps) => {
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
      <Input
        value={search}
        onChangeText={onSearchChange}
        placeholder="Busque um time"
        icon
      />

      {isLoading ? (
        <Box sx={styles.skeletons}>
          <TeamButtonSkeleton />
          <TeamButtonSkeleton />
        </Box>
      ) : (
        <DripsyFlatList
          sx={{ flex: 1 }}
          data={teams}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TeamButton
              color={item.color}
              name={item.name}
              onPress={() => onTeamPress(item)}
            />
          )}
          ListEmptyComponent={<EmptyState isTeam search={search} />}
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

      <Button onPress={onCreatePress}>Criar time</Button>
    </Box>
  );
};
