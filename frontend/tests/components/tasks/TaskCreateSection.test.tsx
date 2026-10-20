import { TaskCreateSection } from "@/components/tasks/TaskCreateSection";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const mockOnSubmit = jest.fn();
const mockUseCreateTask = jest.fn();
const mockLoadMore = jest.fn();

jest.mock("@/viewmodels/tasks/hooks/useCreateTask", () => {
  const { useForm } = jest.requireActual("react-hook-form");
  return {
    useCreateTask: (task?: unknown) => {
      mockUseCreateTask(task);
      const form = useForm({ defaultValues: { title: "" } });
      return {
        control: form.control,
        errors: {},
        isSubmitting: false,
        isEdit: task !== undefined,
        onSubmit: mockOnSubmit,
      };
    },
  };
});

jest.mock("@/viewmodels/teams/hooks/useTeams", () => ({
  useTeams: () => ({
    teams: [{ id: 1, name: "Frontend", color: "#3B82F6", createdAt: "" }],
    isLoading: false,
    isLoadingMore: false,
    loadMore: mockLoadMore,
  }),
}));

describe("TaskCreateSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the form in create mode by default", () => {
    renderWithTheme(<TaskCreateSection />);
    expect(mockUseCreateTask).toHaveBeenCalledWith(undefined);
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should pass the task to the view model in edit mode", () => {
    const task = {
      id: 3,
      title: "Write the README",
      description: null,
      status: "PENDING" as const,
      teams: [],
      createdAt: "",
    };
    renderWithTheme(<TaskCreateSection task={task} />);
    expect(mockUseCreateTask).toHaveBeenCalledWith(task);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
  });

  it("should feed the teams select with the teams view model", () => {
    renderWithTheme(<TaskCreateSection />);
    fireEvent.press(screen.getByText("Selecione os times"));
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
  });

  it("should forward the submit to the view model", () => {
    renderWithTheme(<TaskCreateSection />);
    fireEvent.press(screen.getByText("Criar"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
