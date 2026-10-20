import { TaskEditSection } from "@/components/tasks/TaskEditSection";
import { ActivityIndicator } from "react-native";
import { renderWithTheme, screen } from "../../utils/render";

const mockUseTaskDetail = jest.fn();

jest.mock("@/viewmodels/tasks/hooks/useTaskDetail", () => ({
  useTaskDetail: (id: number) => mockUseTaskDetail(id),
}));

jest.mock("@/components/tasks/TaskCreateSection", () => {
  const { Text } = jest.requireActual("react-native");
  return {
    TaskCreateSection: ({ task }: { task: { title: string } }) => (
      <Text>{`form:${task.title}`}</Text>
    ),
  };
});

describe("TaskEditSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should load the task by the given id", () => {
    mockUseTaskDetail.mockReturnValue({ task: undefined, isLoading: true });
    renderWithTheme(<TaskEditSection id={4} />);
    expect(mockUseTaskDetail).toHaveBeenCalledWith(4);
  });

  it("should render a spinner while loading", () => {
    mockUseTaskDetail.mockReturnValue({ task: undefined, isLoading: true });
    renderWithTheme(<TaskEditSection id={4} />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it("should render an error message when the task fails to load", () => {
    mockUseTaskDetail.mockReturnValue({
      task: undefined,
      isLoading: false,
      error: new Error("boom"),
    });
    renderWithTheme(<TaskEditSection id={4} />);
    expect(
      screen.getByText("Não foi possível carregar a tarefa"),
    ).toBeOnTheScreen();
  });

  it("should render an error message when there is no task", () => {
    mockUseTaskDetail.mockReturnValue({ task: undefined, isLoading: false });
    renderWithTheme(<TaskEditSection id={4} />);
    expect(
      screen.getByText("Não foi possível carregar a tarefa"),
    ).toBeOnTheScreen();
  });

  it("should render the form with the loaded task", () => {
    mockUseTaskDetail.mockReturnValue({
      task: { id: 4, title: "Write the README" },
      isLoading: false,
    });
    renderWithTheme(<TaskEditSection id={4} />);
    expect(screen.getByText("form:Write the README")).toBeOnTheScreen();
  });
});
