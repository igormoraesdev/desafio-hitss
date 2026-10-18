import { Flex } from "dripsy";
import { Skeleton } from "../ui/Skeleton";

const styles = {
  content: {
    height: 96,
    width: "100%",
    borderRadius: 6,
    paddingVertical: "$5",
    paddingHorizontal: "$4",
    backgroundColor: "$bgSecondary",
    justifyContent: "space-between",
    alignItems: "center",
  },
  left: {
    gap: "$4",
    alignItems: "center",
  },
} as const;

export const TeamButtonSkeleton = () => {
  return (
    <Flex sx={styles.content}>
      <Flex sx={styles.left}>
        <Skeleton sx={{ width: 24, height: 24, borderRadius: 12 }} />
        <Skeleton sx={{ width: 140, height: 16 }} />
      </Flex>
      <Skeleton sx={{ width: 16, height: 24 }} />
    </Flex>
  );
};
