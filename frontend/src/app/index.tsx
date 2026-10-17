import BackIcon from "@/assets/icons/back.svg";
import TrashIcon from "@/assets/icons/trash.svg";
import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { Button } from "@/components/ui/Button";
import { Box, createThemedComponent } from "dripsy";

const BackIconComponent = createThemedComponent(BackIcon);
const TrashIconComponent = createThemedComponent(TrashIcon);

export default function HomeScreen() {
  return (
    <Container
      header={
        <HeaderButtons
          leftIcon={<BackIconComponent sx={{ color: "$white" }} />}
          righIcon={<TrashIconComponent sx={{ color: "$white" }} />}
        />
      }
      content={
        <Box
          sx={{
            flex: 1,
            width: "100%",
            backgroundColor: "$grey",
            gap: "$3",
          }}
        >
          <Button>Criar time</Button>
        </Box>
      }
    />
  );
}
