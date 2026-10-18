import { Box, SafeAreaView, Text } from "dripsy";
import { ReactElement } from "react";

type ContainerProps = {
  header?: ReactElement;
  content?: ReactElement | ReactElement[];
  spaceTitleContent?: number;
  title: string;
  description: string;
};

export const Container = ({
  header,
  content,
  spaceTitleContent,
  title,
  description,
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
        <Box sx={{ flex: 1, marginTop: spaceTitleContent ?? "$6" }}>
          <Box sx={{ gap: "$2", alignItems: "center" }}>
            <Text variant="h1" sx={{ color: "$white" }}>
              {title}
            </Text>
            <Text variant="paragraph" sx={{ color: "$darkGrey" }}>
              {description}
            </Text>
          </Box>
          {content}
        </Box>
      </Box>
    </SafeAreaView>
  );
};
