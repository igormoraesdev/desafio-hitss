import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { Box, createThemedComponent, Flex } from "dripsy";
import { GestureResponderEvent, Platform } from "react-native";
import { Button } from "../ui/Button";

type HeaderButtonsProps = {
  leftIcon?: boolean;
  editIcon?: boolean;
  rightIcon?: boolean;
  onLeftPress?: (event: GestureResponderEvent) => void;
  onEditPress?: (event: GestureResponderEvent) => void;
  onRightPress?: (event: GestureResponderEvent) => void;
};

const ChevronIconComponent = createThemedComponent(Entypo);
const FeatherIconComponent = createThemedComponent(Feather);

const styles = {
  row: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: Platform.select({ ios: "$3", android: "$6" }),
  },
  group: {
    alignItems: "center",
    gap: "$4",
  },
  icon: {
    color: "$white",
  },
} as const;

export const HeaderButtons = ({
  leftIcon,
  editIcon,
  rightIcon,
  onLeftPress,
  onEditPress,
  onRightPress,
}: HeaderButtonsProps) => {
  return (
    <Flex sx={styles.row}>
      {leftIcon ? (
        <Button hasStyle={false} onPress={onLeftPress}>
          <ChevronIconComponent
            name="chevron-thin-left"
            size={24}
            sx={styles.icon}
          />
        </Button>
      ) : (
        <Box />
      )}
      <Flex sx={styles.group}>
        {editIcon && (
          <Button hasStyle={false} onPress={onEditPress}>
            <FeatherIconComponent name="edit-2" size={22} sx={styles.icon} />
          </Button>
        )}
        {rightIcon && (
          <Button hasStyle={false} onPress={onRightPress}>
            <FeatherIconComponent name="trash-2" size={24} sx={styles.icon} />
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
