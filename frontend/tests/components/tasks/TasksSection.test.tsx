import { TasksSection } from "@/components/tasks/TasksSection";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const mockPush = jest.fn();
const mockSetSearch = jest.fn();
const mockSetFilters = jest.fn();
const mockUpdateStatus = jest.fn().mockResolvedValue(undefined);

jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

jest.mock("@/viewmodels/tasks/hooks/useTasks", () => ({
  useTasks: () => ({
    tasks: [
      {
        id: 1,
        title: "Write the README",
        description: null,
        status: "PENDING",
        teams: [{ id: 7, name: "Frontend", color: "#3B82F6", createdAt: "" }],
        createdAt: "",
      },
    ],
    search: "",
    isLoading: false,
    isLoadingMore: false,
    filters: { limit: 10, sortBy: "createdAt", order: "desc" },
    setSearch: mockSetSearch,
    setFilters: mockSetFilters,
    refetch: jest.fn(),
    loadMore: jest.fn(),
    updateStatus: mockUpdateStatus,
    updatingTaskId: undefined,
  }),
}));

describe("TasksSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the tasks with their team chips", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    expect(screen.getByText("Write the README")).toBeOnTheScreen();
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByTestId("team-chip-dot")).toHaveStyle({
      backgroundColor: "#3B82F6",
    });
  });

  it("should navigate to the task detail when a task is pressed", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    fireEvent.press(screen.getByText("Write the README"));
    expect(mockPush).toHaveBeenCalledWith("/tasks/1");
  });

  it("should navigate to the new task screen when create is pressed", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    fireEvent.press(screen.getByText("Nova tarefa"));
    expect(mockPush).toHaveBeenCalledWith("/tasks/new");
  });

  it("should forward the search text to the view model", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Busque uma tarefa"),
      "readme",
    );
    expect(mockSetSearch).toHaveBeenCalledWith("readme");
  });

  it("should forward the applied filters to the view model", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    fireEvent.press(screen.getByTestId("icon-sliders"));
    fireEvent.press(screen.getByText("Concluída"));
    fireEvent.press(screen.getByText("Aplicar"));
    expect(mockSetFilters).toHaveBeenCalledWith({
      status: "COMPLETED",
      sortBy: "createdAt",
      order: "desc",
    });
  });

  it("should update the status through the view model", () => {
    renderWithTheme(<TasksSection teamId={7} />);
    fireEvent.press(screen.getByTestId("icon-more-vertical"));
    fireEvent.press(screen.getByText("Em progresso"));
    expect(mockUpdateStatus).toHaveBeenCalledWith({
      id: 1,
      status: "IN_PROGRESS",
    });
  });
});
