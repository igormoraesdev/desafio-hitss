import { Container } from "@/components/layout/Container";
import { TeamsSection } from "@/components/teams/TeamsSection";

export default function TeamsScreen() {
  return (
    <Container
      title="Times"
      description="Acesse um dos times"
      content={<TeamsSection />}
    />
  );
}
