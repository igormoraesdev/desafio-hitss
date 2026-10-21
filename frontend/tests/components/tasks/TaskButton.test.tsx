import { TaskButton } from "@/components/tasks/TaskButton";
import { ActivityIndicator } from "react-native";
import { makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const defaultProps = {
  title: "Write the README",
  teams: [makeTeam({ id: 1, name: "Frontend", color: "#3B82F6" })],
  description: "Document how to run the project",
  status: "PENDING" as const,
};

describe("TaskButton", () => {
  it("should render title, team name and description", () => {
    renderWithTheme(<TaskButton {...defaultProps} />);
    expect(screen.getByText("Write the README")).toBeOnTheScreen();
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(
      screen.getByText("Document how to run the project"),
    ).toBeOnTheScreen();
  });

  it("should render one chip per team with the team color", () => {
    renderWithTheme(
      <TaskButton
        {...defaultProps}
        teams={[
          makeTeam({ id: 1, name: "Frontend", color: "#3B82F6" }),
          makeTeam({ id: 2, name: "QA", color: "#F59E0B" }),
        ]}
      />,
    );
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByText("QA")).toBeOnTheScreen();
    const dots = screen.getAllByTestId("team-chip-dot");
    expect(dots).toHaveLength(2);
    expect(dots[0]).toHaveStyle({ backgroundColor: "#3B82F6" });
    expect(dots[1]).toHaveStyle({ backgroundColor: "#F59E0B" });
  });

  it("should render a placeholder when the task has no team", () => {
    renderWithTheme(<TaskButton {...defaultProps} teams={[]} />);
    expect(screen.getByText("Sem time")).toBeOnTheScreen();
    expect(screen.queryAllByTestId("team-chip-dot")).toHaveLength(0);
  });

  it("should render the status badge with the status label", () => {
    renderWithTheme(<TaskButton {...defaultProps} status="IN_PROGRESS" />);
    expect(screen.getByText("Em progresso")).toBeOnTheScreen();
  });

  it("should render a spinner in the badge while updating", () => {
    renderWithTheme(<TaskButton {...defaultProps} isUpdating />);
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
    expect(screen.queryByText("Pendente")).toBeNull();
  });

  it("should render without a description", () => {
    renderWithTheme(<TaskButton {...defaultProps} description={null} />);
    expect(screen.getByText("Write the README")).toBeOnTheScreen();
  });

  it("should call onPress when the card is pressed", () => {
    const onPress = jest.fn();
    renderWithTheme(<TaskButton {...defaultProps} onPress={onPress} />);
    fireEvent.press(screen.getByText("Write the README"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("should not render the status menu without onChangeStatus", () => {
    renderWithTheme(<TaskButton {...defaultProps} />);
    expect(screen.queryByTestId("icon-more-vertical")).toBeNull();
  });

  it("should open the status menu from the menu button", () => {
    renderWithTheme(
      <TaskButton {...defaultProps} onChangeStatus={jest.fn()} />,
    );
    expect(screen.queryByText("Alterar status")).toBeNull();
    fireEvent.press(screen.getByTestId("icon-more-vertical"));
    expect(screen.getByText("Alterar status")).toBeOnTheScreen();
  });

  it("should call onChangeStatus with the chosen status", () => {
    const onChangeStatus = jest.fn();
    renderWithTheme(
      <TaskButton {...defaultProps} onChangeStatus={onChangeStatus} />,
    );
    fireEvent.press(screen.getByTestId("icon-more-vertical"));
    fireEvent.press(screen.getByText("Concluída"));
    expect(onChangeStatus).toHaveBeenCalledWith("COMPLETED");
    expect(screen.queryByText("Alterar status")).toBeNull();
  });

  it("should not call onChangeStatus when the same status is chosen", () => {
    const onChangeStatus = jest.fn();
    renderWithTheme(
      <TaskButton {...defaultProps} onChangeStatus={onChangeStatus} />,
    );
    fireEvent.press(screen.getByTestId("icon-more-vertical"));
    fireEvent.press(screen.getAllByText("Pendente")[1]);
    expect(onChangeStatus).not.toHaveBeenCalled();
  });
});
