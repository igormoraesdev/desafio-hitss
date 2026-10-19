import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import { createThemedComponent, Flex } from "dripsy";
import { GestureResponderEvent, Platform } from "react-native";
import { Button } from "../ui/Button";

type HeaderButtonsProps = {
  leftIcon?: boolean;
  rightIcon?: boolean;
  onLeftPress?: (event: GestureResponderEvent) => void;
  onRightPress?: (event: GestureResponderEvent) => void;
};

const ChevronIconComponent = createThemedComponent(Entypo);
const TrashIconComponent = createThemedComponent(Feather);

export const HeaderButtons = ({
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: HeaderButtonsProps) => {
  return (
    <Flex
      sx={{
        width: "100%",
        height: 40,
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: Platform.select({ ios: "$3", android: "$6" }),
      }}
    >
      {leftIcon && (
        <Button hasStyle={false} onPress={onLeftPress}>
          <ChevronIconComponent
            name="chevron-thin-left"
            size={24}
            sx={{ color: "$white" }}
          />
        </Button>
      )}
      {rightIcon && (
        <Button hasStyle={false} onPress={onRightPress}>
          <TrashIconComponent
            name="trash-2"
            size={24}
            sx={{ color: "$white" }}
          />
        </Button>
      )}
    </Flex>
  );
};
