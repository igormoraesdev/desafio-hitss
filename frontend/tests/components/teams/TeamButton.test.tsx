import { TeamButton } from "@/components/teams/TeamButton";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("TeamButton", () => {
  it("should render the team name", () => {
    renderWithTheme(<TeamButton name="Frontend" color="#3B82F6" />);
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
  });

  it("should render the team icon with the team color", () => {
    renderWithTheme(<TeamButton name="Frontend" color="#3B82F6" />);
    expect(screen.getByTestId("icon-users")).toHaveStyle({ color: "#3B82F6" });
  });

  it("should render the chevron icon", () => {
    renderWithTheme(<TeamButton name="Frontend" color="#3B82F6" />);
    expect(screen.getByTestId("icon-chevron-thin-right")).toBeOnTheScreen();
  });

  it("should call onPress when pressed", () => {
    const onPress = jest.fn();
    renderWithTheme(
      <TeamButton name="Frontend" color="#3B82F6" onPress={onPress} />,
    );
    fireEvent.press(screen.getByText("Frontend"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
