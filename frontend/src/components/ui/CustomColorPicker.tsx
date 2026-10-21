import Feather from "@expo/vector-icons/Feather";
import { createThemedComponent, Flex, Pressable, styled, Text } from "dripsy";
import { ComponentProps, forwardRef, Fragment, useState } from "react";
import { Modal, View as RNView } from "react-native";
import ColorPicker, {
  ColorFormatsObject,
  HueSlider,
  Panel1,
  Preview,
} from "reanimated-color-picker";
import { Button } from "./Button";

const StyledModalContent = styled(Pressable)();
const StyledOverlay = styled(Pressable)();
const CloseIconComponent = createThemedComponent(Feather);

type CustomColorPickerProps = Omit<
  ComponentProps<typeof Pressable>,
  "children" | "style"
> & {
  value?: string;
  onChangeColor?: (item: string) => void;
};

export const CustomColorPicker = forwardRef<RNView, CustomColorPickerProps>(
  ({ value, onChangeColor }, ref) => {
    const [showModal, setShowModal] = useState(false);
    const [color, setColor] = useState(value || "#FFFFFF");

    const onSelectColor = ({ hex }: ColorFormatsObject) => {
      onChangeColor?.(hex);
      setColor(hex);
    };

    const handlePress = () => {
      setShowModal(true);
    };

    return (
      <Fragment>
        <Button
          ref={ref}
          onPress={handlePress}
          sx={{
            width: "100%",
            height: 56,
            backgroundColor: "$bgTerciary",
            borderRadius: 6,
            padding: "$3",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="paragraph"
            sx={{
              color: "$darkGrey",
            }}
          >
            Cor do time
          </Text>

          <Flex
            testID="color-picker-swatch"
            sx={{
              width: 24,
              height: 24,
              backgroundColor: color,
              border: "solid",
              borderWidth: 1,
              borderColor: "$white",
              borderRadius: "100%",
            }}
          />
        </Button>
        <Modal
          visible={showModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <StyledOverlay
            onPress={() => setShowModal(false)}
            sx={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              justifyContent: "flex-end",
            }}
          >
            <StyledModalContent
              onPress={(e) => e.stopPropagation()}
              sx={{
                backgroundColor: "$bgTerciary",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                padding: "$4",
                maxHeight: "100%",
                height: "40%",
              }}
            >
              <Flex
                sx={{
                  width: "100%",
                  justifyContent: "flex-end",
                  marginBottom: "$3",
                }}
              >
                <Button hasStyle={false} onPress={() => setShowModal(false)}>
                  <CloseIconComponent
                    name="x"
                    size={24}
                    sx={{ color: "$white" }}
                  />
                </Button>
              </Flex>
              <ColorPicker
                style={{ width: "100%" }}
                value={color}
                onCompleteJS={onSelectColor}
              >
                <Preview hideInitialColor />
                <Panel1 />
                <HueSlider />
              </ColorPicker>
            </StyledModalContent>
          </StyledOverlay>
        </Modal>
      </Fragment>
    );
  },
);

CustomColorPicker.displayName = "CustomColorPicker";
