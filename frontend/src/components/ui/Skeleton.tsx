import { View } from "dripsy";
import { ComponentProps, useEffect } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const AnimatedView = Animated.createAnimatedComponent(View);

type SkeletonProps = Omit<ComponentProps<typeof View>, "style">;

export const Skeleton = ({ sx, ...rest }: SkeletonProps) => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(0.4, { duration: 700 }), -1, true);
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedView
      {...rest}
      style={animatedStyle}
      sx={{ backgroundColor: "$bgTerciary", borderRadius: 4, ...sx }}
    />
  );
};
