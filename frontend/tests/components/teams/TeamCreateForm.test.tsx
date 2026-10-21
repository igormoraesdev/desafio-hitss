import { TeamCreateForm } from "@/components/teams/TeamCreateForm";
import { CreateTeamFormSchema } from "@/schemas/team.schema";
import { FieldErrors, useForm } from "react-hook-form";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

jest.mock("reanimated-color-picker", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  HueSlider: () => null,
  Panel1: () => null,
  Preview: () => null,
}));

type HarnessProps = {
  errors?: FieldErrors<CreateTeamFormSchema>;
  isSubmitting?: boolean;
  isEdit?: boolean;
  defaultValues?: CreateTeamFormSchema;
  onSubmit?: () => void;
};

const Harness = ({
  errors = {},
  isSubmitting = false,
  isEdit,
  defaultValues = { name: "", color: "" },
  onSubmit = jest.fn(),
}: HarnessProps) => {
  const form = useForm<CreateTeamFormSchema>({ defaultValues });
  return (
    <TeamCreateForm
      control={form.control}
      errors={errors}
      isSubmitting={isSubmitting}
      isEdit={isEdit}
      onSubmit={onSubmit}
    />
  );
};

describe("TeamCreateForm", () => {
  it("should render the name input, the color picker and the submit button", () => {
    renderWithTheme(<Harness />);
    expect(screen.getByPlaceholderText("Nome do time")).toBeOnTheScreen();
    expect(screen.getByText("Cor do time")).toBeOnTheScreen();
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should render Salvar as the submit label in edit mode", () => {
    renderWithTheme(<Harness isEdit />);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
    expect(screen.queryByText("Criar")).toBeNull();
  });

  it("should render the initial values", () => {
    renderWithTheme(
      <Harness defaultValues={{ name: "Frontend", color: "#3B82F6" }} />,
    );
    expect(screen.getByPlaceholderText("Nome do time")).toHaveDisplayValue(
      "Frontend",
    );
    expect(screen.getByTestId("color-picker-swatch")).toHaveStyle({
      backgroundColor: "#3B82F6",
    });
  });

  it("should update the name input when typing", () => {
    renderWithTheme(<Harness />);
    const input = screen.getByPlaceholderText("Nome do time");
    fireEvent.changeText(input, "Design");
    expect(input).toHaveDisplayValue("Design");
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
          name: { type: "min", message: "Informe o nome do time" },
          color: { type: "regex", message: "Escolha uma cor" },
        }}
      />,
    );
    expect(screen.getByText("Informe o nome do time")).toBeOnTheScreen();
    expect(screen.getByText("Escolha uma cor")).toBeOnTheScreen();
  });

  it("should not render validation messages when there are no errors", () => {
    renderWithTheme(<Harness />);
    expect(screen.queryByText("Informe o nome do time")).toBeNull();
    expect(screen.queryByText("Escolha uma cor")).toBeNull();
  });
});
