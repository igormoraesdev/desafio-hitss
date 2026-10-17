import { Box, SafeAreaView, Text } from "dripsy";
import { ReactElement } from "react";

type ContainerProps = {
  header?: ReactElement;
  content?: ReactElement | ReactElement[];
  spaceTitleContent?: number;
};

export const Container = ({
  header,
  content,
  spaceTitleContent,
}: ContainerProps) => {
  return (
    <SafeAreaView
      sx={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "$bgPrimary",
      }}
    >
      <Box sx={{ flex: 1, paddingHorizontal: "$4" }}>
        {header}
        <Box sx={{ flex: 1, marginTop: spaceTitleContent ?? 120 }}>
          <Box sx={{ gap: "$2", alignItems: "center" }}>
            <Text variant="h1" sx={{ color: "$white" }}>
              Times
            </Text>
            <Text variant="paragraph" sx={{ color: "$darkGrey" }}>
              Acesse um dos times
            </Text>
          </Box>
          {content}
        </Box>
      </Box>
    </SafeAreaView>
  );
};
