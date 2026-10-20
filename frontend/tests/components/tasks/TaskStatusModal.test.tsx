import { TaskStatusModal } from "@/components/tasks/TaskStatusModal";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("TaskStatusModal", () => {
  it("should render nothing when not visible", () => {
    renderWithTheme(
      <TaskStatusModal
        visible={false}
        status="PENDING"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.queryByText("Alterar status")).toBeNull();
  });

  it("should render the default title and every status option", () => {
    renderWithTheme(
      <TaskStatusModal
        visible
        status="PENDING"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText("Alterar status")).toBeOnTheScreen();
    expect(screen.getByText("Pendente")).toBeOnTheScreen();
    expect(screen.getByText("Em progresso")).toBeOnTheScreen();
    expect(screen.getByText("Concluída")).toBeOnTheScreen();
  });

  it("should render a custom title", () => {
    renderWithTheme(
      <TaskStatusModal
        visible
        title="Selecione um status"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getByText("Selecione um status")).toBeOnTheScreen();
  });

  it("should mark only the current status with a check icon", () => {
    renderWithTheme(
      <TaskStatusModal
        visible
        status="IN_PROGRESS"
        onClose={jest.fn()}
        onSelect={jest.fn()}
      />,
    );
    expect(screen.getAllByTestId("icon-check")).toHaveLength(1);
  });

  it("should not mark any option without a current status", () => {
    renderWithTheme(
      <TaskStatusModal visible onClose={jest.fn()} onSelect={jest.fn()} />,
    );
    expect(screen.queryByTestId("icon-check")).toBeNull();
  });

  it("should call onSelect with the pressed status", () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <TaskStatusModal
        visible
        status="PENDING"
        onClose={jest.fn()}
        onSelect={onSelect}
      />,
    );
    fireEvent.press(screen.getByText("Concluída"));
    expect(onSelect).toHaveBeenCalledWith("COMPLETED");
  });
});
