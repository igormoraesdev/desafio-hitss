import { TeamButtonSkeleton } from "@/components/teams/TeamButtonSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { renderWithTheme, screen } from "../../utils/render";

describe("TeamButtonSkeleton", () => {
  it("should render three skeleton blocks", () => {
    renderWithTheme(<TeamButtonSkeleton />);
    expect(screen.UNSAFE_getAllByType(Skeleton)).toHaveLength(3);
  });

  it("should not render any text", () => {
    renderWithTheme(<TeamButtonSkeleton />);
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
