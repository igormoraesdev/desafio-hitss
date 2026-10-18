import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TeamButton } from "@/components/layout/TeamButton";
import { Button } from "@/components/ui/Button";
import { CustomColorPicker } from "@/components/ui/CustomColorPicker";
import { Input } from "@/components/ui/Input";
import { ItemProps, Select } from "@/components/ui/Select";
import { Box } from "dripsy";
import { useState } from "react";

export default function HomeScreen() {
  const times = [
    { label: "Flamengo", value: "flamengo" },
    { label: "Palmeiras", value: "palmeiras" },
    { label: "São Paulo", value: "sao_paulo" },
  ];
  const [selectedValue, setSelectedValue] = useState<ItemProps>({
    label: "Flamengo",
    value: "flamengo",
  });
  return (
    <Container
      title="Times"
      description="Acesse um dos times"
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
          <Select
            data={times}
            selectedValue={selectedValue}
            onSelect={(v: ItemProps) => setSelectedValue(v)}
            placeholder="Selecione um time"
            placeholderModal="Selecione um time"
          />
          <CustomColorPicker />
          <Button>Criar time</Button>
          <TeamButton name="Flamengo" color="#f21717" />
        </Box>
      }
    />
  );
}
