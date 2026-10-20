import {
  DEFAULT_TASK_FILTERS,
  TasksFilters,
} from "@/components/tasks/TasksFilters";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const defaultProps = {
  search: "",
  filters: DEFAULT_TASK_FILTERS,
  onSearchChange: jest.fn(),
  onFiltersChange: jest.fn(),
};

describe("TasksFilters", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the search input and the filter button", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    expect(screen.getByPlaceholderText("Busque uma tarefa")).toBeOnTheScreen();
    expect(screen.getByTestId("icon-sliders")).toBeOnTheScreen();
  });

  it("should call onSearchChange when typing", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    fireEvent.changeText(
      screen.getByPlaceholderText("Busque uma tarefa"),
      "readme",
    );
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith("readme");
  });

  it("should open the filters modal from the filter button", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    expect(screen.queryByText("Filtros")).toBeNull();
    fireEvent.press(screen.getByTestId("icon-sliders"));
    expect(screen.getByText("Filtros")).toBeOnTheScreen();
    expect(screen.getByText("Todas")).toBeOnTheScreen();
    expect(screen.getByText("Mais recentes")).toBeOnTheScreen();
  });

  it("should apply the chosen status", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    fireEvent.press(screen.getByTestId("icon-sliders"));
    fireEvent.press(screen.getByText("Pendente"));
    fireEvent.press(screen.getByText("Aplicar"));
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      ...DEFAULT_TASK_FILTERS,
      status: "PENDING",
    });
    expect(screen.queryByText("Filtros")).toBeNull();
  });

  it("should apply the chosen sort", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    fireEvent.press(screen.getByTestId("icon-sliders"));
    fireEvent.press(screen.getByText("Título A-Z"));
    fireEvent.press(screen.getByText("Aplicar"));
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      status: undefined,
      sortBy: "title",
      order: "asc",
    });
  });

  it("should reset to the default filters when cleared", () => {
    renderWithTheme(
      <TasksFilters
        {...defaultProps}
        filters={{ status: "COMPLETED", sortBy: "title", order: "asc" }}
      />,
    );
    fireEvent.press(screen.getByTestId("icon-sliders"));
    fireEvent.press(screen.getByText("Limpar filtros"));
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(
      DEFAULT_TASK_FILTERS,
    );
    expect(screen.queryByText("Filtros")).toBeNull();
  });

  it("should not apply the draft until Aplicar is pressed", () => {
    renderWithTheme(<TasksFilters {...defaultProps} />);
    fireEvent.press(screen.getByTestId("icon-sliders"));
    fireEvent.press(screen.getByText("Concluída"));
    expect(defaultProps.onFiltersChange).not.toHaveBeenCalled();
  });
});
