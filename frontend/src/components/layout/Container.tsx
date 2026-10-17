import { SafeAreaView } from "dripsy";
import { ReactElement } from "react";

type ContainerProps = {
  children: ReactElement;
};

export const Container = ({ children }: ContainerProps) => {
  return (
    <SafeAreaView sx={{ flex: 1, backgroundColor: "$bgPrimary" }}>
      {children}
    </SafeAreaView>
  );
};
