import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TeamCreateSection } from "@/components/teams/TeamCreateSection";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createThemedComponent } from "dripsy";
import { useRouter } from "expo-router";

const TeamIcon = createThemedComponent(MaterialCommunityIcons);

export default function NewTeamScreen() {
  const router = useRouter();

  return (
    <Container
      title="Novo time"
      description="crie seu time para gerenciar as tarefas"
      spaceTitleContent={130}
      header={<HeaderButtons leftIcon onLeftPress={router.back} />}
      titleIcon={
        <TeamIcon
          name="account-group-outline"
          size={56}
          sx={{ color: "$green" }}
        />
      }
      content={<TeamCreateSection />}
    />
  );
}
