import { Box, Flex, Text } from "dripsy";

type TeamChipProps = {
  name: string;
  color: string;
};

const styles = {
  chip: {
    alignItems: "center",
    gap: "$1",
    height: 24,
    paddingHorizontal: "$2",
    borderRadius: 100,
    backgroundColor: "$bgTerciary",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  name: {
    color: "$grey",
  },
} as const;

export const TeamChip = ({ name, color }: TeamChipProps) => {
  return (
    <Flex sx={styles.chip}>
      <Box
        testID="team-chip-dot"
        sx={{ ...styles.dot, backgroundColor: color }}
      />
      <Text variant="small" sx={styles.name}>
        {name}
      </Text>
    </Flex>
  );
};
