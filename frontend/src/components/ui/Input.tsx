import Feather from "@expo/vector-icons/Feather";
import { createThemedComponent, Flex, styled, Sx, TextInput } from "dripsy";
import { ComponentProps, forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";

const SearchIconComponent = createThemedComponent(Feather);
const StyledTextInput = styled(TextInput)();
type InputProps = ComponentProps<typeof StyledTextInput> & {
  icon?: boolean;
  containerSx?: Sx;
};

const styles = {
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    gap: "$2",
    width: "100%",
    backgroundColor: "$bgTerciary",
    borderRadius: 6,
  },
  input: {
    flex: 1,
    backgroundColor: "$bgTerciary",
    height: 56,
    paddingVertical: "$3",
    paddingLeft: "$3",
    borderRadius: 6,
    color: "$darkGrey",
  },
  iconSlot: {
    alignItems: "center",
    justifyContent: "center",
    height: 32,
    width: 32,
    marginRight: "$3",
  },
  icon: {
    color: "$green",
  },
} as const;

export const Input = forwardRef<RNTextInput, InputProps>(
  ({ icon, containerSx, sx, multiline, ...rest }, ref) => {
    return (
      <Flex sx={{ ...styles.container, ...containerSx }}>
        <StyledTextInput
          {...rest}
          ref={ref}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          variant="text.paragraph"
          placeholderTextColor={"#7C7C8A"}
          sx={{ ...styles.input, paddingRight: icon ? 0 : "$3", ...sx }}
        />
        {icon && (
          <Flex sx={styles.iconSlot}>
            <SearchIconComponent size={24} name="search" sx={styles.icon} />
          </Flex>
        )}
      </Flex>
    );
  },
);

Input.displayName = "Input";
