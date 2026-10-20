import { TaskStatusSelect } from "@/components/tasks/TaskStatusSelect";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("TaskStatusSelect", () => {
  it("should render the placeholder when there is no value", () => {
    renderWithTheme(<TaskStatusSelect onChange={jest.fn()} />);
    expect(screen.getByText("Selecione um status")).toBeOnTheScreen();
  });

  it("should render the status label when there is a value", () => {
    renderWithTheme(
      <TaskStatusSelect value="COMPLETED" onChange={jest.fn()} />,
    );
    expect(screen.getByText("Concluída")).toBeOnTheScreen();
  });

  it("should open the options when pressed", () => {
    renderWithTheme(<TaskStatusSelect onChange={jest.fn()} />);
    fireEvent.press(screen.getByText("Selecione um status"));
    expect(screen.getByText("Pendente")).toBeOnTheScreen();
    expect(screen.getByText("Em progresso")).toBeOnTheScreen();
    expect(screen.getByText("Concluída")).toBeOnTheScreen();
  });

  it("should call onChange with the chosen status and close", () => {
    const onChange = jest.fn();
    renderWithTheme(<TaskStatusSelect onChange={onChange} />);
    fireEvent.press(screen.getByText("Selecione um status"));
    fireEvent.press(screen.getByText("Em progresso"));
    expect(onChange).toHaveBeenCalledWith("IN_PROGRESS");
    expect(screen.queryByText("Pendente")).toBeNull();
  });

  it("should not call onChange when the current status is chosen", () => {
    const onChange = jest.fn();
    renderWithTheme(<TaskStatusSelect value="PENDING" onChange={onChange} />);
    fireEvent.press(screen.getAllByText("Pendente")[0]);
    fireEvent.press(screen.getAllByText("Pendente")[1]);
    expect(onChange).not.toHaveBeenCalled();
  });
});
