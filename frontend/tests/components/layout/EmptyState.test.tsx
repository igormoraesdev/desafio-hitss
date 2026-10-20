import { EmptyState } from "@/components/layout/EmptyState";
import { renderWithTheme, screen } from "../../utils/render";

describe("EmptyState", () => {
  it("should invite to create the first team when there is no search", () => {
    renderWithTheme(<EmptyState search="" isTeam />);
    expect(screen.getByText("Nenhum time encontrado")).toBeOnTheScreen();
    expect(
      screen.getByText("Crie o primeiro time para começar."),
    ).toBeOnTheScreen();
  });

  it("should show the searched term for teams", () => {
    renderWithTheme(<EmptyState search=" design " isTeam />);
    expect(screen.getByText('Não há times com "design".')).toBeOnTheScreen();
  });

  it("should invite to create the first task when there is no search", () => {
    renderWithTheme(<EmptyState search="" isTeam={false} />);
    expect(screen.getByText("Nenhuma tarefa encontrada")).toBeOnTheScreen();
    expect(
      screen.getByText("Crie a primeira tarefa para começar."),
    ).toBeOnTheScreen();
  });

  it("should show the searched term for tasks", () => {
    renderWithTheme(<EmptyState search="deploy" isTeam={false} />);
    expect(screen.getByText('Não há tarefas com "deploy".')).toBeOnTheScreen();
  });
});
