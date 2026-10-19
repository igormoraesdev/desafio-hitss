import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { createThemedComponent, Flex, Text } from "dripsy";
import { Button } from "../ui/Button";

const TeamIcon = createThemedComponent(FontAwesome);
const ChevronIcon = createThemedComponent(Entypo);

type TeamButonProps = {
  name: string;
  color: string;
  onPress?: () => void;
};

const styles = {
  content: {
    height: 96,
    width: "100%",
    borderRadius: 6,
    paddingVertical: "$5",
    paddingHorizontal: "$4",
    backgroundColor: "$bgSecondary",
  },
  row: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "$white",
  },
} as const;

export const TeamButton = ({ name, color, onPress }: TeamButonProps) => {
  return (
    <Button sx={styles.content} onPress={onPress}>
      <Flex sx={styles.row}>
        <Flex sx={{ gap: "$4", alignItems: "center" }}>
          <TeamIcon name="users" size={24} sx={{ color }} />
          <Text sx={styles.text}>{name}</Text>
        </Flex>
        <ChevronIcon name="chevron-thin-right" size={24} sx={styles.text} />
      </Flex>
    </Button>
  );
};
