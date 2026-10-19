import { Box, Text } from "dripsy";

type EmptyStateProps = {
  search: string;
  isTeam: boolean;
};

const styles = {
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

export const EmptyState = ({ search, isTeam = true }: EmptyStateProps) => {
  const hasSearch = search.trim().length > 0;

  const title = isTeam ? "Nenhum time encontrado" : "Nenhuma tarefa encontrada";
  const textNotFound = `Não há ${isTeam ? "times" : "tarefas"} com "${search.trim()}".`;
  const textFirstItem = isTeam
    ? "Crie o primeiro time para começar."
    : "Crie a primeira tarefa para começar.";

  return (
    <Box sx={styles.empty}>
      <Text variant="h2" sx={styles.emptyTitle}>
        {title}
      </Text>
      <Text variant="paragraph" sx={styles.emptyDescription}>
        {hasSearch ? textNotFound : textFirstItem}
      </Text>
    </Box>
  );
};
