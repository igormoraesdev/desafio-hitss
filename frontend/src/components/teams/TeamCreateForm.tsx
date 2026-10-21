import { CreateTeamFormSchema } from "@/schemas/team.schema";
import { Box, Text } from "dripsy";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Button } from "../ui/Button";
import { CustomColorPicker } from "../ui/CustomColorPicker";
import { Input } from "../ui/Input";

type TeamCreateFormProps = {
  control: Control<CreateTeamFormSchema>;
  errors: FieldErrors<CreateTeamFormSchema>;
  apiError?: string;
  isSubmitting: boolean;
  isEdit?: boolean;
  onSubmit: () => void;
};

export const TeamCreateForm = ({
  control,
  errors,
  apiError,
  isSubmitting,
  isEdit,
  onSubmit,
}: TeamCreateFormProps) => {
  return (
    <Box sx={{ gap: "$3", marginTop: "$5" }}>
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <Input
            placeholder="Nome do time"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
          />
        )}
      />
      {errors.name && <Text sx={{ color: "$red" }}>{errors.name.message}</Text>}

      <Controller
        control={control}
        name="color"
        render={({ field }) => (
          <CustomColorPicker
            value={field.value}
            onChangeColor={field.onChange}
          />
        )}
      />
      {errors.color && (
        <Text sx={{ color: "$red" }}>{errors.color.message}</Text>
      )}
      {apiError && (
        <Text sx={{ color: "$red", textAlign: "center" }}>{apiError}</Text>
      )}
      <Button onPress={onSubmit} disabled={isSubmitting}>
        {isEdit ? "Salvar" : "Criar"}
      </Button>
    </Box>
  );
};
