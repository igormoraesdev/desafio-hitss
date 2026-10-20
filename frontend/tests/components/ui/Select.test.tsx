import { Select } from "@/components/ui/Select";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

const data = [
  { label: "Frontend", value: "1" },
  { label: "Backend", value: "2" },
];

describe("Select", () => {
  it("should render the placeholder when nothing is selected", () => {
    renderWithTheme(<Select data={data} placeholder="Pick a team" />);
    expect(screen.getByText("Pick a team")).toBeOnTheScreen();
  });

  it("should render the selected value label", () => {
    renderWithTheme(<Select data={data} selectedValue={data[1]} />);
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should open the options when pressed", () => {
    renderWithTheme(
      <Select data={data} placeholder="Pick a team" placeholderModal="Teams" />,
    );
    expect(screen.queryByText("Teams")).toBeNull();

    fireEvent.press(screen.getByText("Pick a team"));

    expect(screen.getByText("Teams")).toBeOnTheScreen();
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.getByText("Backend")).toBeOnTheScreen();
  });

  it("should call onSelect and show the chosen label", () => {
    const onSelect = jest.fn();
    renderWithTheme(
      <Select data={data} placeholder="Pick a team" onSelect={onSelect} />,
    );

    fireEvent.press(screen.getByText("Pick a team"));
    fireEvent.press(screen.getByText("Frontend"));

    expect(onSelect).toHaveBeenCalledWith(data[0]);
    expect(screen.getByText("Frontend")).toBeOnTheScreen();
    expect(screen.queryByText("Pick a team")).toBeNull();
  });
});
