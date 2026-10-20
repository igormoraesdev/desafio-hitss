import { Button } from "@/components/ui/Button";
import { Text } from "dripsy";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("Button", () => {
  it("should render the label when children is a string", () => {
    renderWithTheme(<Button>Create</Button>);
    expect(screen.getByText("Create")).toBeOnTheScreen();
  });

  it("should render custom children", () => {
    renderWithTheme(
      <Button>
        <Text>Content</Text>
      </Button>,
    );
    expect(screen.getByText("Content")).toBeOnTheScreen();
  });

  it("should call onPress when pressed", () => {
    const onPress = jest.fn();
    renderWithTheme(<Button onPress={onPress}>Save</Button>);
    fireEvent.press(screen.getByText("Save"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should not call onPress when disabled", () => {
    const onPress = jest.fn();
    renderWithTheme(
      <Button onPress={onPress} disabled>
        Save
      </Button>,
    );
    fireEvent.press(screen.getByText("Save"));
    expect(onPress).not.toHaveBeenCalled();
  });
});
