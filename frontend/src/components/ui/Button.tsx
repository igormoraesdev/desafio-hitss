import { Pressable, Text } from "dripsy";
import { ComponentProps, ReactElement } from "react";
import { StyleProp, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ButtonProps = Omit<
  ComponentProps<typeof Pressable>,
  "children" | "style"
> & {
  children?: string | ReactElement | ReactElement[];
  hasStyle?: boolean;
  style?: StyleProp<ViewStyle>;
};

const baseSx = {
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: 56,
  backgroundColor: "$green",
  borderRadius: 6,
} as const;

const iconSx = {
  height: 32,
  width: 32,
  alignItems: "center",
  justifyContent: "center",
} as const;

export const Button = ({
  children,
  hasStyle = true,
  sx,
  style,
  ...rest
}: ButtonProps) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scheduleOnUI(() => {
      opacity.value = withTiming(0.85, { duration: 100 });
    });
  };

  const handlePressOut = () => {
    scheduleOnUI(() => {
      opacity.value = withTiming(1, { duration: 150 });
    });
  };

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[animatedStyle, style]}
      sx={{ ...(hasStyle ? baseSx : iconSx), ...sx }}
    >
      {typeof children === "string" ? (
        <Text variant="paragraphBold" sx={{ color: "$white" }}>
          {children}
        </Text>
      ) : (
        children
      )}
    </AnimatedPressable>
  );
};
