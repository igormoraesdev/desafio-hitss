import { TeamList } from "@/components/teams/TeamsList";
import { TeamButtonSkeleton } from "@/components/teams/TeamButtonSkeleton";
import { ActivityIndicator } from "react-native";
import { makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const teams = [
  makeTeam({ id: 1, name: "Frontend" }),
  makeTeam({ id: 2, name: "Backend", color: "#00875F" }),
];

const defaultProps = {
  teams,
  search: "",
  isLoading: false,
  onSearchChange: jest.fn(),
  onTeamPress: jest.fn(),
};

describe("TeamList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the search input with the search icon", () => {
    renderWithTheme(<TeamList {...defaultProps} />);
    expect(screen.getByPlaceholderText("Busque um time")).toBeOnTheScreen();
    expect(screen.getByTestId("icon-search")).toBeOnTheScreen();
  });

  it("should call onSearchChange when typing in the search input", () => {
    renderWithTheme(<TeamList {...defaultProps} />);
    fireEvent.changeText(screen.getByPlaceholderText("Busque um time"), "fro");
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("fro");
  });

  it("should render skeletons instead of the list while loading", () => {
    renderWithTheme(<TeamList {...defaultProps} isLoading />);
    expect(screen.UNSAFE_getAllByType(TeamButtonSkeleton)).toHaveLength(2);
    expect(screen.queryByText("Frontend")).toBeNull();
  });

  it("should render one button per team", () => {
    renderWithTheme(<TeamList {...defaultProps} />);
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should call onTeamPress with the pressed team", () => {
    renderWithTheme(<TeamList {...defaultProps} />);
    fireEvent.press(screen.getByText("Backend"));
    expect(defaultProps.onTeamPress).toHaveBeenCalledWith(teams[1]);
  });

  it("should render the empty state when there are no teams", () => {
    renderWithTheme(<TeamList {...defaultProps} teams={[]} />);
    expect(screen.getByText("Nenhum time encontrado")).toBeOnTheScreen();
    expect(
      screen.getByText("Crie o primeiro time para começar."),
    ).toBeOnTheScreen();
  });

  it("should render the empty state with the searched term", () => {
    renderWithTheme(<TeamList {...defaultProps} teams={[]} search="design" />);
    expect(screen.getByText('Não há times com "design".')).toBeOnTheScreen();
  });

  it("should render the footer spinner while loading more", () => {
    renderWithTheme(<TeamList {...defaultProps} isLoadingMore />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it("should not render the footer spinner by default", () => {
    renderWithTheme(<TeamList {...defaultProps} />);
    expect(screen.UNSAFE_queryAllByType(ActivityIndicator)).toHaveLength(0);
  });

  it("should call onCreatePress when the create button is pressed", () => {
    const onCreatePress = jest.fn();
    renderWithTheme(
      <TeamList {...defaultProps} onCreatePress={onCreatePress} />,
    );
    fireEvent.press(screen.getByText("Criar time"));
    expect(onCreatePress).toHaveBeenCalledTimes(1);
  });
});
