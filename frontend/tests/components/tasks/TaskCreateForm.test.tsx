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

type HarnessProps = {
  errors?: FieldErrors<CreateTaskFormInput>;
  isSubmitting?: boolean;
  isEdit?: boolean;
  onSubmit?: () => void;
  defaultValues?: Partial<CreateTaskFormInput>;
};

const Harness = ({
  errors = {},
  isSubmitting = false,
  isEdit,
  onSubmit = jest.fn(),
  defaultValues,
}: HarnessProps) => {
  const form = useForm<CreateTaskFormInput, unknown, CreateTaskFormSchema>({
    defaultValues: { title: "", ...defaultValues },
  });
  return (
    <TaskCreateForm
      control={form.control}
      errors={errors}
      isSubmitting={isSubmitting}
      isEdit={isEdit}
      onSubmit={onSubmit}
      teams={teams}
    />
  );
};

describe("TaskCreateForm", () => {
  it("should render every field and the create button", () => {
    renderWithTheme(<Harness />);
    expect(screen.getByPlaceholderText("Titulo")).toBeOnTheScreen();
    expect(screen.getByPlaceholderText("Descrição")).toBeOnTheScreen();
    expect(screen.getByText("Selecione os times")).toBeOnTheScreen();
    expect(screen.getByText("Selecione um status")).toBeOnTheScreen();
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should render the save button in edit mode", () => {
    renderWithTheme(<Harness isEdit />);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
    expect(screen.queryByText("Criar")).toBeNull();
  });

  it("should render the initial values", () => {
    renderWithTheme(
      <Harness
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
    renderWithTheme(<Harness />);
    const input = screen.getByPlaceholderText("Titulo");
    fireEvent.changeText(input, "Ship the app");
    expect(input).toHaveDisplayValue("Ship the app");
  });

  it("should select teams through the teams select", () => {
    renderWithTheme(<Harness />);
    fireEvent.press(screen.getByText("Selecione os times"));
    fireEvent.press(screen.getByText("Backend"));
    fireEvent.press(screen.getByText("Concluir"));
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should select a status through the status select", () => {
    renderWithTheme(<Harness />);
    fireEvent.press(screen.getByText("Selecione um status"));
    fireEvent.press(screen.getByText("Em progresso"));
    expect(screen.getByText("Em progresso")).toBeOnTheScreen();
    expect(screen.queryByText("Selecione um status")).toBeNull();
  });

  it("should call onSubmit when the submit button is pressed", () => {
    const onSubmit = jest.fn();
    renderWithTheme(<Harness onSubmit={onSubmit} />);
    fireEvent.press(screen.getByText("Criar"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should not call onSubmit while submitting", () => {
    const onSubmit = jest.fn();
    renderWithTheme(<Harness onSubmit={onSubmit} isSubmitting />);
    fireEvent.press(screen.getByText("Criar"));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("should render the validation messages", () => {
    renderWithTheme(
      <Harness
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
