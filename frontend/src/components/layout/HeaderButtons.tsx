import { Flex } from "dripsy";
import { ReactElement } from "react";
import { GestureResponderEvent } from "react-native";
import { SvgProps } from "react-native-svg";
import { Button } from "../ui/Button";

type HeaderButtonsProps = {
  leftIcon?: ReactElement | React.FC<SvgProps>;
  righIcon?: ReactElement;
  onLeftPress?: (event: GestureResponderEvent) => void;
  onRightPress?: (event: GestureResponderEvent) => void;
};

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
          {leftIcon as ReactElement}
        </Button>
      )}
      {righIcon && (
        <Button hasStyle={false} onPress={onRightPress}>
          {righIcon as ReactElement}
        </Button>
      )}
    </Flex>
  );
};
