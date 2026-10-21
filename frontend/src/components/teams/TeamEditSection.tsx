import { theme } from "@/styles/theme";
import { useTeamsDetail } from "@/viewmodels/teams/hooks/useTeamsDetail";
import { Box, Text } from "dripsy";
import { ActivityIndicator } from "react-native";
import { TeamCreateSection } from "./TeamCreateSection";

type TeamEditSectionProps = {
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

export const TeamEditSection = ({ id }: TeamEditSectionProps) => {
  const { team, isLoading, error } = useTeamsDetail(id);

  if (isLoading) {
    return (
      <Box sx={styles.feedback}>
        <ActivityIndicator color={theme.colors.$green} />
      </Box>
    );
  }

  if (error || !team) {
    return (
      <Box sx={styles.feedback}>
        <Text variant="paragraph" sx={{ color: "$darkGrey" }}>
          Não foi possível carregar o time
        </Text>
      </Box>
    );
  }

  return <TeamCreateSection team={team} />;
};
