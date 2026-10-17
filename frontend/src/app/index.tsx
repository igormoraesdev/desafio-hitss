import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Box } from "dripsy";

export default function HomeScreen() {
  return (
    <Container
      header={<HeaderButtons leftIcon righIcon />}
      content={
        <Box
          sx={{
            flex: 1,
            width: "100%",
            backgroundColor: "$grey",
            gap: "$3",
          }}
        >
          <Input placeholder={"test"} icon />
          <Button>Criar time</Button>
        </Box>
      }
    />
  );
}
