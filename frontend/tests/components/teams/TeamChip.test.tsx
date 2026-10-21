import { TeamChip } from "@/components/teams/TeamChip";
import { renderWithTheme, screen } from "../../utils/render";

describe("TeamChip", () => {
  it("should render the team name", () => {
    renderWithTheme(<TeamChip name="Frontend" color="#3B82F6" />);
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
  });

  it("should paint the dot with the team color", () => {
    renderWithTheme(<TeamChip name="Frontend" color="#3B82F6" />);
    expect(screen.getByTestId("team-chip-dot")).toHaveStyle({
      backgroundColor: "#3B82F6",
    });
  });
});
