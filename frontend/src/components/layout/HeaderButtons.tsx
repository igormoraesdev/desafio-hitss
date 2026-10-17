import BackIcon from "@/assets/icons/back.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { createThemedComponent, Flex } from "dripsy";
import { GestureResponderEvent } from "react-native";
import { Button } from "../ui/Button";

type HeaderButtonsProps = {
  leftIcon?: boolean;
  righIcon?: boolean;
  onLeftPress?: (event: GestureResponderEvent) => void;
  onRightPress?: (event: GestureResponderEvent) => void;
};

const BackIconComponent = createThemedComponent(BackIcon);
const TrashIconComponent = createThemedComponent(TrashIcon);

export const HeaderButtons = ({
  leftIcon,
  righIcon,
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
        marginTop: "$3",
      }}
    >
      {leftIcon && (
        <Button hasStyle={false} onPress={onLeftPress}>
          <BackIconComponent sx={{ color: "$white" }} />
        </Button>
      )}
      {righIcon && (
        <Button hasStyle={false} onPress={onRightPress}>
          <TrashIconComponent sx={{ color: "$white" }} />
        </Button>
      )}
    </Flex>
  );
};
