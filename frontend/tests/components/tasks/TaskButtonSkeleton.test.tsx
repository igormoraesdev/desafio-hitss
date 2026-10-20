import { TaskButtonSkeleton } from "@/components/tasks/TaskButtonSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";
import { renderWithTheme, screen } from "../../utils/render";

describe("TaskButtonSkeleton", () => {
  it("should render five skeleton blocks", () => {
    renderWithTheme(<TaskButtonSkeleton />);
    expect(screen.UNSAFE_getAllByType(Skeleton)).toHaveLength(5);
  });

  it("should not render any text", () => {
    renderWithTheme(<TaskButtonSkeleton />);
    expect(screen.queryByText(/.+/)).toBeNull();
  });
});
