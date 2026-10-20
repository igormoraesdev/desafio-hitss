import { theme } from "@/styles/theme";
import { render, RenderOptions } from "@testing-library/react-native";
import { DripsyProvider } from "dripsy";
import { ReactElement, ReactNode } from "react";

const Providers = ({ children }: { children: ReactNode }) => (
  <DripsyProvider theme={theme}>{children}</DripsyProvider>
);

export const renderWithTheme = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react-native";
