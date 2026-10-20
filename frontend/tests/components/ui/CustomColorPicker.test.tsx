import { CustomColorPicker } from "@/components/ui/CustomColorPicker";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

jest.mock("reanimated-color-picker", () => {
  const React = jest.requireActual("react");
  const { Pressable, Text } = jest.requireActual("react-native");
  const ColorPicker = ({
    onCompleteJS,
    children,
  }: {
    onCompleteJS: (color: { hex: string }) => void;
    children: React.ReactNode;
  }) =>
    React.createElement(
      Pressable,
      {
        testID: "color-picker",
        onPress: () => onCompleteJS({ hex: "#00B37E" }),
      },
      React.createElement(Text, null, "picker"),
      children,
    );
  const Noop = () => null;
  return {
    __esModule: true,
    default: ColorPicker,
    HueSlider: Noop,
    Panel1: Noop,
    Preview: Noop,
  };
});

describe("CustomColorPicker", () => {
  it("should render the trigger label", () => {
    renderWithTheme(<CustomColorPicker />);
    expect(screen.getByText("Cor do time")).toBeOnTheScreen();
  });

  it("should open the picker when pressed", () => {
    renderWithTheme(<CustomColorPicker />);
    expect(screen.queryByTestId("color-picker")).toBeNull();

    fireEvent.press(screen.getByText("Cor do time"));

    expect(screen.getByTestId("color-picker")).toBeOnTheScreen();
    expect(screen.getByTestId("icon-x")).toBeOnTheScreen();
  });

  it("should call onChangeColor with the picked hex", () => {
    const onChangeColor = jest.fn();
    renderWithTheme(<CustomColorPicker onChangeColor={onChangeColor} />);

    fireEvent.press(screen.getByText("Cor do time"));
    fireEvent.press(screen.getByTestId("color-picker"));

    expect(onChangeColor).toHaveBeenCalledWith("#00B37E");
  });

  it("should close the picker from the close button", () => {
    renderWithTheme(<CustomColorPicker />);

    fireEvent.press(screen.getByText("Cor do time"));
    fireEvent.press(screen.getByTestId("icon-x"));

    expect(screen.queryByTestId("color-picker")).toBeNull();
  });
});
