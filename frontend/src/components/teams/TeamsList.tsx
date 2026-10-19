import { Teams } from "@/models/team";
import { Box, styled, Sx, Text } from "dripsy";
import { useState } from "react";
import { FlatList, FlatListProps } from "react-native";
import { TeamButton } from "../layout/TeamButton";
import { TeamButtonSkeleton } from "../layout/TeamButtonSkeleton";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

const DripsyFlatList = styled(FlatList)() as <T>(
  props: FlatListProps<T> & { sx?: Sx },
) => React.ReactElement;

type TeamListProps = {
  teams: Teams[];
  search: string;
  isLoading: boolean;
  refetch?: () => Promise<unknown>;
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
  },
  skeletons: {
    flex: 1,
    gap: "$3",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: "$2",
    paddingHorizontal: "$4",
  },
  emptyTitle: {
    color: "$white",
    textAlign: "center",
  },
  emptyDescription: {
    color: "$darkGrey",
    textAlign: "center",
  },
} as const;

type EmptyStateProps = {
  search: string;
};

const EmptyState = ({ search }: EmptyStateProps) => {
  const hasSearch = search.trim().length > 0;

  return (
    <Box sx={styles.empty}>
      <Text variant="h2" sx={styles.emptyTitle}>
        Nenhum time encontrado
      </Text>
      <Text variant="paragraph" sx={styles.emptyDescription}>
        {hasSearch
          ? `Não há times com "${search.trim()}".`
          : "Crie o primeiro time para começar."}
      </Text>
    </Box>
  );
};

export const TeamList = ({
  teams,
  search,
  isLoading,
  refetch,
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
          ListEmptyComponent={<EmptyState search={search} />}
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
