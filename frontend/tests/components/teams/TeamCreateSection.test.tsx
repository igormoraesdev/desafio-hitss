import { TeamCreateSection } from "@/components/teams/TeamCreateSection";
import { makeTeam } from "../../utils/fixtures";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const mockOnSubmit = jest.fn();
const mockUseCreateTeam = jest.fn();

jest.mock("reanimated-color-picker", () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
  HueSlider: () => null,
  Panel1: () => null,
  Preview: () => null,
}));

jest.mock("@/viewmodels/teams/hooks/useCreateTeam", () => {
  const { useForm } = jest.requireActual("react-hook-form");
  return {
    useCreateTeam: (team?: unknown) => {
      mockUseCreateTeam(team);
      const form = useForm({ defaultValues: { name: "", color: "" } });
      return {
        control: form.control,
        errors: { name: { type: "min", message: "Informe o nome do time" } },
        isSubmitting: false,
        isEdit: team !== undefined,
        onSubmit: mockOnSubmit,
      };
    },
  };
});

describe("TeamCreateSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the form fed by the view model", () => {
    renderWithTheme(<TeamCreateSection />);
    expect(screen.getByPlaceholderText("Nome do time")).toBeOnTheScreen();
    expect(screen.getByText("Informe o nome do time")).toBeOnTheScreen();
  });

  it("should start in create mode without a team", () => {
    renderWithTheme(<TeamCreateSection />);
    expect(mockUseCreateTeam).toHaveBeenCalledWith(undefined);
    expect(screen.getByText("Criar")).toBeOnTheScreen();
  });

  it("should pass the team to the view model in edit mode", () => {
    const team = makeTeam({ id: 3, name: "QA" });
    renderWithTheme(<TeamCreateSection team={team} />);
    expect(mockUseCreateTeam).toHaveBeenCalledWith(team);
    expect(screen.getByText("Salvar")).toBeOnTheScreen();
  });

  it("should forward the submit to the view model", () => {
    renderWithTheme(<TeamCreateSection />);
    fireEvent.press(screen.getByText("Criar"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
