import { Text } from "react-native";

const Icon = ({ name, ...rest }: { name: string }) => (
  <Text {...rest} testID={`icon-${name}`}>
    {name}
  </Text>
);

export default Icon;
export const Feather = Icon;
