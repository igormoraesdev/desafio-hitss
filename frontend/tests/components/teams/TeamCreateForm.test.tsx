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

type ComponentProps = {
  errors?: FieldErrors<CreateTeamFormSchema>;
  isSubmitting?: boolean;
  isEdit?: boolean;
  apiError?: string;
  defaultValues?: CreateTeamFormSchema;
  onSubmit?: () => void;
};

const Component = ({
  errors = {},
  isSubmitting = false,
  isEdit,
  apiError,
  defaultValues = { name: "", color: "" },
  onSubmit = jest.fn(),
}: ComponentProps) => {
  const form = useForm<CreateTeamFormSchema>({ defaultValues });
  return (
    <TeamCreateForm
      control={form.control}
      errors={errors}
      isSubmitting={isSubmitting}
      isEdit={isEdit}
      apiError={apiError}
      onSubmit={onSubmit}
    />
  );
};

describe("TeamCreateForm", () => {
  it("should render the name input, the color picker and the submit button", () => {
    renderWithTheme(<Component />);
    expect(screen.getByPlaceholderText("Nome do time")).toBeOnTheScreen();
    expect(screen.getByText("Cor do time")).toBeOnTheScreen();
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should render Salvar as the submit label in edit mode", () => {
    renderWithTheme(<Component isEdit />);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
    expect(screen.queryByText("Criar")).toBeNull();
  });

  it("should render the initial values", () => {
    renderWithTheme(
      <Component defaultValues={{ name: "Frontend", color: "#3B82F6" }} />,
    );
    expect(screen.getByPlaceholderText("Nome do time")).toHaveDisplayValue(
      "Frontend",
    );
    expect(screen.getByTestId("color-picker-swatch")).toHaveStyle({
      backgroundColor: "#3B82F6",
    });
  });

  it("should update the name input when typing", () => {
    renderWithTheme(<Component />);
    const input = screen.getByPlaceholderText("Nome do time");
    fireEvent.changeText(input, "Design");
    expect(input).toHaveDisplayValue("Design");
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
    renderWithTheme(<Component apiError='Já existe um time com o nome "QA"' />);
    expect(
      screen.getByText('Já existe um time com o nome "QA"'),
    ).toBeOnTheScreen();
  });

  it("should render the validation messages", () => {
    renderWithTheme(
      <Component
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
    renderWithTheme(<Component />);
    expect(screen.queryByText("Informe o nome do time")).toBeNull();
    expect(screen.queryByText("Escolha uma cor")).toBeNull();
  });
});
