import { Container } from "@/components/layout/Container";
import { HeaderButtons } from "@/components/layout/HeaderButtons";
import { TaskCreateSection } from "@/components/tasks/TaskCreateSection";

import AntDesign from "@expo/vector-icons/AntDesign";
import { createThemedComponent } from "dripsy";
import { useRouter } from "expo-router";

const CheckIcon = createThemedComponent(AntDesign);

export default function NewTaskscreen() {
  const router = useRouter();

  return (
    <Container
      title="Nova tarefa"
      description="crie sua tarefa"
      spaceTitleContent={80}
      header={<HeaderButtons leftIcon onLeftPress={router.back} />}
      titleIcon={
        <CheckIcon name="check-square" size={56} sx={{ color: "$green" }} />
      }
      content={<TaskCreateSection />}
    />
  );
}
