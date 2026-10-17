import { Pressable, Text } from "dripsy";
import { ReactElement } from "react";
import { PressableProps } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnUI } from "react-native-worklets";

type ButtonProps = PressableProps & {
  children?: string | ReactElement;
  hasStyle?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const Button = ({ children, hasStyle = true, ...rest }: ButtonProps) => {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scheduleOnUI(() => {
      opacity.value = withTiming(0.5, { duration: 100 });
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
      style={[animatedStyle]}
      sx={
        hasStyle
          ? {
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: 56,
              backgroundColor: "$green",
              borderRadius: 6,
            }
          : {
              height: 32,
              width: 32,
              alignItems: "center",
              justifyContent: "center",
            }
      }
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
