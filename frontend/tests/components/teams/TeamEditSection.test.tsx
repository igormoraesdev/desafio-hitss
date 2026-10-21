import { TeamEditSection } from "@/components/teams/TeamEditSection";
import { ActivityIndicator } from "react-native";
import { renderWithTheme, screen } from "../../utils/render";

const mockUseTeamsDetail = jest.fn();

jest.mock("@/viewmodels/teams/hooks/useTeamsDetail", () => ({
  useTeamsDetail: (id: number) => mockUseTeamsDetail(id),
}));

jest.mock("@/components/teams/TeamCreateSection", () => {
  const { Text } = jest.requireActual("react-native");
  return {
    TeamCreateSection: ({ team }: { team: { name: string } }) => (
      <Text>{`form:${team.name}`}</Text>
    ),
  };
});

describe("TeamEditSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should load the team by the given id", () => {
    mockUseTeamsDetail.mockReturnValue({ team: undefined, isLoading: true });
    renderWithTheme(<TeamEditSection id={3} />);
    expect(mockUseTeamsDetail).toHaveBeenCalledWith(3);
  });

  it("should render a spinner while loading", () => {
    mockUseTeamsDetail.mockReturnValue({ team: undefined, isLoading: true });
    renderWithTheme(<TeamEditSection id={3} />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it("should render an error message when the team fails to load", () => {
    mockUseTeamsDetail.mockReturnValue({
      team: undefined,
      isLoading: false,
      error: new Error("boom"),
    });
    renderWithTheme(<TeamEditSection id={3} />);
    expect(
      screen.getByText("Não foi possível carregar o time"),
    ).toBeOnTheScreen();
  });

  it("should render an error message when there is no team", () => {
    mockUseTeamsDetail.mockReturnValue({ team: undefined, isLoading: false });
    renderWithTheme(<TeamEditSection id={3} />);
    expect(
      screen.getByText("Não foi possível carregar o time"),
    ).toBeOnTheScreen();
  });

  it("should render the form with the loaded team", () => {
    mockUseTeamsDetail.mockReturnValue({
      team: { id: 3, name: "QA" },
      isLoading: false,
    });
    renderWithTheme(<TeamEditSection id={3} />);
    expect(screen.getByText("form:QA")).toBeOnTheScreen();
  });
});
