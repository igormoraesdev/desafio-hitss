import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TeamEditSection } from "@/components/teams/TeamEditSection";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { createThemedComponent } from "dripsy";
import { useLocalSearchParams, useRouter } from "expo-router";

const TeamIcon = createThemedComponent(MaterialCommunityIcons);

export default function EditTeamScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <Container
      title="Editar time"
      description="altere o nome ou a cor do time"
      spaceTitleContent={130}
      header={<HeaderButtons leftIcon onLeftPress={router.back} />}
      titleIcon={
        <TeamIcon
          name="account-group-outline"
          size={56}
          sx={{ color: "$green" }}
        />
      }
      content={<TeamEditSection id={Number(id)} />}
    />
  );
}
