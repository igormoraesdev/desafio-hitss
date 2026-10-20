import { TeamsSelect } from "@/components/teams/TeamsSelect";
import { ActivityIndicator } from "react-native";
import { makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const teams = [
  makeTeam({ id: 1, name: "Frontend" }),
  makeTeam({ id: 2, name: "Backend", color: "#00875F" }),
];

describe("TeamsSelect", () => {
  it("should render the placeholder when nothing is selected", () => {
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[]} onChange={jest.fn()} />,
    );
    expect(screen.getByText("Selecione os times")).toBeOnTheScreen();
  });

  it("should render the selected team names joined by comma", () => {
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[1, 2]} onChange={jest.fn()} />,
    );
    expect(screen.getByText("Frontend, Backend")).toBeOnTheScreen();
  });

  it("should open the options with the title when pressed", () => {
    renderWithTheme(
      <TeamsSelect
        teams={teams}
        selectedIds={[]}
        onChange={jest.fn()}
        title="Times da tarefa"
      />,
    );
    expect(screen.queryByText("Times da tarefa")).toBeNull();

    fireEvent.press(screen.getByText("Selecione os times"));

    expect(screen.getByText("Times da tarefa")).toBeOnTheScreen();
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should add a team to the selection when pressed", () => {
    const onChange = jest.fn();
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[1]} onChange={onChange} />,
    );
    fireEvent.press(screen.getByText("Frontend"));
    fireEvent.press(screen.getByText("Backend"));
    expect(onChange).toHaveBeenCalledWith([1, 2]);
  });

  it("should remove a team from the selection when pressed again", () => {
    const onChange = jest.fn();
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[1, 2]} onChange={onChange} />,
    );
    fireEvent.press(screen.getByText("Frontend, Backend"));
    fireEvent.press(screen.getAllByText("Frontend")[0]);
    expect(onChange).toHaveBeenCalledWith([2]);
  });

  it("should mark only the selected teams with a check icon", () => {
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[2]} onChange={jest.fn()} />,
    );
    fireEvent.press(screen.getByText("Backend"));
    expect(screen.getAllByTestId("icon-check")).toHaveLength(1);
  });

  it("should render a spinner instead of the list while loading", () => {
    renderWithTheme(
      <TeamsSelect
        teams={[]}
        selectedIds={[]}
        onChange={jest.fn()}
        isLoading
      />,
    );
    fireEvent.press(screen.getByText("Selecione os times"));
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
    expect(screen.queryByText("Nenhum time encontrado")).toBeNull();
  });

  it("should render the empty message when there are no teams", () => {
    renderWithTheme(
      <TeamsSelect teams={[]} selectedIds={[]} onChange={jest.fn()} />,
    );
    fireEvent.press(screen.getByText("Selecione os times"));
    expect(screen.getByText("Nenhum time encontrado")).toBeOnTheScreen();
  });

  it("should render the footer spinner while loading more", () => {
    renderWithTheme(
      <TeamsSelect
        teams={teams}
        selectedIds={[]}
        onChange={jest.fn()}
        isLoadingMore
      />,
    );
    fireEvent.press(screen.getByText("Selecione os times"));
    expect(screen.UNSAFE_getAllByType(ActivityIndicator)).toHaveLength(1);
  });

  it("should close the options from the done button", () => {
    renderWithTheme(
      <TeamsSelect teams={teams} selectedIds={[]} onChange={jest.fn()} />,
    );
    fireEvent.press(screen.getByText("Selecione os times"));
    fireEvent.press(screen.getByText("Concluir"));
    expect(screen.queryByText("Frontend")).toBeNull();
  });
});
