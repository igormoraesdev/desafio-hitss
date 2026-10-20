import { Input } from "@/components/ui/Input";
import { fireEvent, renderWithTheme, screen } from "../../utils/render";

describe("Input", () => {
  it("should render the placeholder", () => {
    renderWithTheme(<Input placeholder="Title" />);
    expect(screen.getByPlaceholderText("Title")).toBeOnTheScreen();
  });

  it("should call onChangeText when typing", () => {
    const onChangeText = jest.fn();
    renderWithTheme(<Input placeholder="Title" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText("Title"), "New task");
    expect(onChangeText).toHaveBeenCalledWith("New task");
  });

  it("should not render the search icon by default", () => {
    renderWithTheme(<Input placeholder="Title" />);
    expect(screen.queryByTestId("icon-search")).toBeNull();
  });

  it("should render the search icon when icon is true", () => {
    renderWithTheme(<Input placeholder="Search" icon />);
    expect(screen.getByTestId("icon-search")).toBeOnTheScreen();
  });

  it("should align text to the top when multiline", () => {
    renderWithTheme(<Input placeholder="Description" multiline />);
    expect(screen.getByPlaceholderText("Description")).toHaveProp(
      "textAlignVertical",
      "top",
    );
  });

  it("should center text when single line", () => {
    renderWithTheme(<Input placeholder="Title" />);
    expect(screen.getByPlaceholderText("Title")).toHaveProp(
      "textAlignVertical",
      "center",
    );
  });

  it("should apply the sx override to the text input", () => {
    renderWithTheme(<Input placeholder="Description" sx={{ height: 152 }} />);
    expect(screen.getByPlaceholderText("Description")).toHaveStyle({
      height: 152,
    });
  });
});
