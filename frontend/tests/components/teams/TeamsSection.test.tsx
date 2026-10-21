import { TeamsSection } from "@/components/teams/TeamsSection";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const mockPush = jest.fn();
const mockSetSearch = jest.fn();
const mockLoadMore = jest.fn();
const mockRefetch = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/viewmodels/teams/hooks/useTeams", () => ({
  useTeams: () => ({
    teams: [
      { id: 1, name: "Frontend", color: "#3B82F6", createdAt: "" },
      { id: 2, name: "Backend", color: "#00875F", createdAt: "" },
    ],
    search: "",
    isLoading: false,
    isLoadingMore: false,
    setSearch: mockSetSearch,
    refetch: mockRefetch,
    loadMore: mockLoadMore,
  }),
}));

describe("TeamsSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the teams from the view model", () => {
    renderWithTheme(<TeamsSection />);
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should navigate to the team detail when a team is pressed", () => {
    renderWithTheme(<TeamsSection />);
    fireEvent.press(screen.getByText("Backend"));
    expect(mockPush).toHaveBeenCalledWith("/teams/2");
  });

  it("should navigate to the new team screen when create is pressed", () => {
    renderWithTheme(<TeamsSection />);
    fireEvent.press(screen.getByText("Criar time"));
    expect(mockPush).toHaveBeenCalledWith("/teams/new");
  });

  it("should navigate to the global tasks list when all tasks is pressed", () => {
    renderWithTheme(<TeamsSection />);
    fireEvent.press(screen.getByText("Ver todas as tarefas"));
    expect(mockPush).toHaveBeenCalledWith("/tasks");
  });

  it("should forward the search text to the view model", () => {
    renderWithTheme(<TeamsSection />);
    fireEvent.changeText(screen.getByPlaceholderText("Busque um time"), "fro");
    expect(mockSetSearch).toHaveBeenCalledWith("fro");
  });
});
