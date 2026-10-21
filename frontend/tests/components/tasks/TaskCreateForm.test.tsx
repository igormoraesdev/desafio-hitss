import { TaskCreateForm } from "@/components/tasks/TaskCreateForm";
import {
  CreateTaskFormInput,
  CreateTaskFormSchema,
} from "@/schemas/task.schema";
import { FieldErrors, useForm } from "react-hook-form";
import { makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const teams = [
  makeTeam({ id: 1, name: "Frontend" }),
  makeTeam({ id: 2, name: "Backend" }),
];

type ComponentProps = {
  errors?: FieldErrors<CreateTaskFormInput>;
  isSubmitting?: boolean;
  isEdit?: boolean;
  apiError?: string;
  onSubmit?: () => void;
  defaultValues?: Partial<CreateTaskFormInput>;
};

const Component = ({
  errors = {},
  isSubmitting = false,
  isEdit,
  apiError,
  onSubmit = jest.fn(),
  defaultValues,
}: ComponentProps) => {
  const form = useForm<CreateTaskFormInput, unknown, CreateTaskFormSchema>({
    defaultValues: { title: "", ...defaultValues },
  });
  return (
    <TaskCreateForm
      control={form.control}
      errors={errors}
      apiError={apiError}
      isSubmitting={isSubmitting}
      isEdit={isEdit}
      onSubmit={onSubmit}
      teams={teams}
    />
  );
};

describe("TaskCreateForm", () => {
  it("should render every field and the create button", () => {
    renderWithTheme(<Component />);
    expect(screen.getByPlaceholderText("Titulo")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("Descrição")).toBeOnTheScreen();
    expect(screen.getByText("Selecione os times")).toBeOnTheScreen();
    expect(screen.getByText("Selecione um status")).toBeOnTheScreen();
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should render the save button in edit mode", () => {
    renderWithTheme(<Component isEdit />);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
    expect(screen.queryByText("Criar")).toBeNull();
  });

  it("should render the initial values", () => {
    renderWithTheme(
      <Component
        defaultValues={{
          title: "Write the README",
          description: "Document it",
          status: "COMPLETED",
          teamIds: [1, 2],
        }}
      />,
    );
    expect(screen.getByPlaceholderText("Titulo")).toHaveDisplayValue(
      "Write the README",
    );
    expect(screen.getByPlaceholderText("Descrição")).toHaveDisplayValue(
      "Document it",
    );
    expect(screen.getByText("Frontend, Backend")).toBeOnTheScreen();
    expect(screen.getByText("Concluída")).toBeOnTheScreen();
  });

  it("should update the title when typing", () => {
    renderWithTheme(<Component />);
    const input = screen.getByPlaceholderText("Titulo");
    fireEvent.changeText(input, "Ship the app");
    expect(input).toHaveDisplayValue("Ship the app");
  });

  it("should select teams through the teams select", () => {
    renderWithTheme(<Component />);
    fireEvent.press(screen.getByText("Selecione os times"));
    fireEvent.press(screen.getByText("Backend"));
    fireEvent.press(screen.getByText("Concluir"));
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should select a status through the status select", () => {
    renderWithTheme(<Component />);
    fireEvent.press(screen.getByText("Selecione um status"));
    fireEvent.press(screen.getByText("Em progresso"));
    expect(screen.getByText("Em progresso")).toBeOnTheScreen();
    expect(screen.queryByText("Selecione um status")).toBeNull();
  });

  it("should call onSubmit when the submit button is pressed", () => {
    const onSubmit = jest.fn();
    renderWithTheme(<Component onSubmit={onSubmit} />);
    fireEvent.press(screen.getByText("Criar"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should not call onSubmit while submitting", () => {
    const onSubmit = jest.fn();
    renderWithTheme(<Component onSubmit={onSubmit} isSubmitting />);
    fireEvent.press(screen.getByText("Criar"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should render the API error above the submit button", () => {
    renderWithTheme(
      <Component apiError="Já existe uma tarefa com esse título" />,
    );
    expect(
      screen.getByText("Já existe uma tarefa com esse título"),
    ).toBeOnTheScreen();
  });

  it("should render the validation messages", () => {
    renderWithTheme(
      <Component
        errors={{
          title: { type: "min", message: "Informe o título da tarefa" },
          description: { type: "max", message: "Descrição longa" },
          status: { type: "invalid", message: "Selecione um status" },
          teamIds: { type: "custom", message: "Times inválidos" },
        }}
      />,
    );
    expect(screen.getByText("Informe o título da tarefa")).toBeOnTheScreen();
    expect(screen.getByText("Descrição longa")).toBeOnTheScreen();
    expect(screen.getAllByText("Selecione um status")).toHaveLength(2);
    expect(screen.getByText("Times inválidos")).toBeOnTheScreen();
  });
});
