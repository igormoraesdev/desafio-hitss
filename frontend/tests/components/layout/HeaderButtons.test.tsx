import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("HeaderButtons", () => {
  it("should render nothing when no icon is enabled", () => {
    renderWithTheme(<HeaderButtons />);
    expect(screen.queryByTestId("icon-chevron-thin-left")).toBeNull();
    expect(screen.queryByTestId("icon-trash-2")).toBeNull();
  });

  it("should render the back button when leftIcon is set", () => {
    renderWithTheme(<HeaderButtons leftIcon />);
    expect(screen.getByTestId("icon-chevron-thin-left")).toBeOnTheScreen();
    expect(screen.queryByTestId("icon-trash-2")).toBeNull();
  });

  it("should render the delete button when rightIcon is set", () => {
    renderWithTheme(<HeaderButtons rightIcon />);
    expect(screen.getByTestId("icon-trash-2")).toBeOnTheScreen();
    expect(screen.queryByTestId("icon-chevron-thin-left")).toBeNull();
  });

  it("should render the edit button when editIcon is set", () => {
    renderWithTheme(<HeaderButtons editIcon />);
    expect(screen.getByTestId("icon-edit-2")).toBeOnTheScreen();
    expect(screen.queryByTestId("icon-trash-2")).toBeNull();
  });

  it("should call onEditPress when the edit button is pressed", () => {
    const onEditPress = jest.fn();
    renderWithTheme(<HeaderButtons editIcon onEditPress={onEditPress} />);
    fireEvent.press(screen.getByTestId("icon-edit-2"));
    expect(onEditPress).toHaveBeenCalledTimes(1);
  });

  it("should call the handlers when each button is pressed", () => {
    const onLeftPress = jest.fn();
    const onRightPress = jest.fn();
    renderWithTheme(
      <HeaderButtons
        leftIcon
        rightIcon
        onLeftPress={onLeftPress}
        onRightPress={onRightPress}
      />,
    );

    fireEvent.press(screen.getByTestId("icon-chevron-thin-left"));
    fireEvent.press(screen.getByTestId("icon-trash-2"));

    expect(onLeftPress).toHaveBeenCalledTimes(1);
    expect(onRightPress).toHaveBeenCalledTimes(1);
  });
});
