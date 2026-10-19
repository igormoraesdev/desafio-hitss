import { Box, Flex } from "dripsy";
import { Skeleton } from "../ui/Skeleton";

const styles = {
  content: {
    minHeight: 144,
    width: "100%",
    borderRadius: 8,
    padding: "$3",
    backgroundColor: "$bgSecondary",
    gap: "$3",
  },
  row: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  titles: {
    gap: "$2",
  },
  description: {
    gap: "$2",
  },
} as const;

export const TaskButtonSkeleton = () => {
  return (
    <Box sx={styles.content}>
      <Flex sx={styles.row}>
        <Box sx={styles.titles}>
          <Skeleton sx={{ width: 180, height: 16 }} />
          <Skeleton sx={{ width: 80, height: 10 }} />
        </Box>
        <Skeleton sx={{ width: 82, height: 26, borderRadius: 100 }} />
      </Flex>
      <Box sx={styles.description}>
        <Skeleton sx={{ width: "100%", height: 12 }} />
        <Skeleton sx={{ width: "70%", height: 12 }} />
      </Box>
    </Box>
  );
};
