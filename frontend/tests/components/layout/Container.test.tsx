import { Container } from "@/components/layout/Container";
import { Text } from "dripsy";
import { renderWithTheme, screen } from "../../utils/render";

describe("Container", () => {
  it("should render title and description", () => {
    renderWithTheme(
      <Container title="Teams" description="manage your teams" />,
    );
    expect(screen.getByText("Teams")).toBeOnTheScreen();
    expect(screen.getByText("manage your teams")).toBeOnTheScreen();
  });

  it("should render header, title icon and content slots", () => {
    renderWithTheme(
      <Container
        title="Teams"
        description="manage your teams"
        header={<Text>header</Text>}
        titleIcon={<Text>icon</Text>}
        content={<Text>content</Text>}
      />,
    );
    expect(screen.getByText("header")).toBeOnTheScreen();
    expect(screen.getByText("icon")).toBeOnTheScreen();
    expect(screen.getByText("content")).toBeOnTheScreen();
  });

  it("should render without optional slots", () => {
    renderWithTheme(
      <Container title="Teams" description="manage your teams" />,
    );
    expect(screen.queryByText("header")).toBeNull();
    expect(screen.queryByText("content")).toBeNull();
  });
});
