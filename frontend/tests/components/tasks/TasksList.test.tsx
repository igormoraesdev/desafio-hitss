import { TaskButtonSkeleton } from "@/components/tasks/TaskButtonSkeleton";
import { DEFAULT_TASK_FILTERS } from "@/components/tasks/TasksFilters";
import { TasksList } from "@/components/tasks/TasksList";
import { ActivityIndicator } from "react-native";
import { makeTask, makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const frontend = makeTeam({ id: 1, name: "Frontend", color: "#3B82F6" });
const qa = makeTeam({ id: 2, name: "QA", color: "#F59E0B" });
const tasks = [
  makeTask({ id: 1, title: "Write the README", teams: [frontend] }),
  makeTask({
    id: 2,
    title: "Ship the app",
    status: "COMPLETED",
    teams: [frontend, qa],
  }),
];

const defaultProps = {
  tasks,
  search: "",
  filters: DEFAULT_TASK_FILTERS,
  isLoading: false,
  onSearchChange: jest.fn(),
  onFiltersChange: jest.fn(),
  onTaskPress: jest.fn(),
};

describe("TasksList", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the search input and the filter button", () => {
    renderWithTheme(<TasksList {...defaultProps} />);
    expect(screen.getByPlaceholderText("Busque uma tarefa")).toBeOnTheScreen();
    expect(screen.getByTestId("icon-sliders")).toBeOnTheScreen();
  });

  it("should render skeletons instead of the list while loading", () => {
    renderWithTheme(<TasksList {...defaultProps} isLoading />);
    expect(screen.UNSAFE_getAllByType(TaskButtonSkeleton)).toHaveLength(3);
    expect(screen.queryByText("Write the README")).toBeNull();
  });

  it("should render one card per task with its team chips", () => {
    renderWithTheme(<TasksList {...defaultProps} />);
    expect(screen.getByText("Write the README")).toBeOnTheScreen();
    expect(screen.getByText("Ship the app")).toBeOnTheScreen();
    expect(screen.getAllByText("Frontend")).toHaveLength(2);
    expect(screen.getByText("QA")).toBeOnTheScreen();
    expect(screen.getAllByTestId("team-chip-dot")).toHaveLength(3);
  });

  it("should call onTaskPress with the pressed task", () => {
    renderWithTheme(<TasksList {...defaultProps} />);
    fireEvent.press(screen.getByText("Ship the app"));
    expect(defaultProps.onTaskPress).toHaveBeenCalledWith(tasks[1]);
  });

  it("should call onChangeStatus with the task and the chosen status", () => {
    const onChangeStatus = jest.fn();
    renderWithTheme(
      <TasksList {...defaultProps} onChangeStatus={onChangeStatus} />,
    );
    fireEvent.press(screen.getAllByTestId("icon-more-vertical")[0]);
    fireEvent.press(screen.getAllByText("Concluída")[0]);
    expect(onChangeStatus).toHaveBeenCalledWith(tasks[0], "COMPLETED");
  });

  it("should not render the status menu without onChangeStatus", () => {
    renderWithTheme(<TasksList {...defaultProps} />);
    expect(screen.queryByTestId("icon-more-vertical")).toBeNull();
  });

  it("should show a spinner on the task being updated", () => {
    renderWithTheme(<TasksList {...defaultProps} updatingTaskId={2} />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
    expect(screen.queryByText("Concluída")).toBeNull();
    expect(screen.getByText("Pendente")).toBeOnTheScreen();
  });

  it("should render the empty state when there are no tasks", () => {
    renderWithTheme(<TasksList {...defaultProps} tasks={[]} />);
    expect(screen.getByText("Nenhuma tarefa encontrada")).toBeOnTheScreen();
    expect(
      screen.getByText("Crie a primeira tarefa para começar."),
    ).toBeOnTheScreen();
  });

  it("should render the empty state with the searched term", () => {
    renderWithTheme(<TasksList {...defaultProps} tasks={[]} search="deploy" />);
    expect(screen.getByText('Não há tarefas com "deploy".')).toBeOnTheScreen();
  });

  it("should render the footer spinner while loading more", () => {
    renderWithTheme(<TasksList {...defaultProps} isLoadingMore />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it("should call onCreatePress when the create button is pressed", () => {
    const onCreatePress = jest.fn();
    renderWithTheme(
      <TasksList {...defaultProps} onCreatePress={onCreatePress} />,
    );
    fireEvent.press(screen.getByText("Nova tarefa"));
    expect(onCreatePress).toHaveBeenCalledTimes(1);
  });
});
