import { Skeleton } from "@/components/ui/Skeleton";
import { renderWithTheme, screen } from "../../utils/render";

describe("Skeleton", () => {
  it("should render with the base style", () => {
    renderWithTheme(<Skeleton testID="skeleton" />);
    expect(screen.getByTestId("skeleton")).toHaveStyle({
      backgroundColor: "#121214",
      borderRadius: 4,
    });
  });

  it("should merge the sx prop over the base style", () => {
    renderWithTheme(
      <Skeleton testID="skeleton" sx={{ width: 120, height: 16 }} />,
    );
    expect(screen.getByTestId("skeleton")).toHaveStyle({
      width: 120,
      height: 16,
      borderRadius: 4,
    });
  });
});
