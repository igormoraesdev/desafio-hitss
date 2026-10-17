import SearchIcon from "@/assets/icons/search.svg";
import { createThemedComponent, Flex, styled, TextInput } from "dripsy";

import { ComponentProps, forwardRef } from "react";
import { TextInput as RNTextInput } from "react-native";

const SearchIconComponent = createThemedComponent(SearchIcon);
const StyledTextInput = styled(TextInput)();
type InputProps = ComponentProps<typeof StyledTextInput> & {
  icon?: boolean;
};

export const Input = forwardRef<RNTextInput, InputProps>(
  ({ icon, ...rest }, ref) => {
    return (
      <Flex
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          height: 56,
          gap: "$2",
          width: "100%",
          backgroundColor: "$bgTerciary",
        }}
      >
        <StyledTextInput
          {...rest}
          ref={ref}
          variant="text.paragraph"
          placeholderTextColor={"#7C7C8A"}
          sx={{
            flex: 1,
            backgroundColor: "$bgTerciary",
            height: 56,
            paddingVertical: "$3",
            paddingLeft: "$3",
            borderRadius: 6,
            color: "$darkGrey",
          }}
        />
        <Flex
          sx={{
            alignItems: "center",
            justifyContent: "center",
            height: 32,
            width: 32,
            marginRight: "$3",
          }}
        >
          {icon && <SearchIconComponent sx={{ color: "$green" }} />}
        </Flex>
      </Flex>
    );
  },
);

Input.displayName = "Input";
