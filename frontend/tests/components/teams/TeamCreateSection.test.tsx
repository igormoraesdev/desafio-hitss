import { TeamCreateSection } from "@/components/teams/TeamCreateSection";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const mockOnSubmit = jest.fn();

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
    useCreateTeam: () => {
      const form = useForm({ defaultValues: { name: "", color: "" } });
      return {
        control: form.control,
        errors: { name: { type: "min", message: "Informe o nome do time" } },
        isSubmitting: false,
        onSubmit: mockOnSubmit,
      };
    },
  };
});

describe("TeamCreateSection", () => {
  it("should render the form fed by the view model", () => {
    renderWithTheme(<TeamCreateSection />);
    expect(screen.getByPlaceholderText("Nome do time")).toBeOnTheScreen();
    expect(screen.getByText("Informe o nome do time")).toBeOnTheScreen();
  });

  it("should forward the submit to the view model", () => {
    renderWithTheme(<TeamCreateSection />);
    fireEvent.press(screen.getByText("Criar"));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
});
