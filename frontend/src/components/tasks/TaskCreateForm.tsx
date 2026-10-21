import { Teams } from "@/models/team";
import {
  CreateTaskFormInput,
  CreateTaskFormSchema,
} from "@/schemas/task.schema";
import { Box, Text } from "dripsy";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Platform } from "react-native";
import { TeamsSelect } from "../teams/TeamsSelect";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TaskStatusSelect } from "./TaskStatusSelect";

type TaskCreateFormProps = {
  control: Control<CreateTaskFormInput, unknown, CreateTaskFormSchema>;
  errors: FieldErrors<CreateTaskFormInput>;
  apiError?: string;
  isSubmitting: boolean;
  isEdit?: boolean;
  onSubmit: () => void;
  teams: Teams[];
  isLoadingTeams?: boolean;
  isLoadingMoreTeams?: boolean;
  onLoadMoreTeams?: () => void;
};

export const TaskCreateForm = ({
  control,
  errors,
  apiError,
  isSubmitting,
  isEdit,
  onSubmit,
  teams,
  isLoadingTeams,
  isLoadingMoreTeams,
  onLoadMoreTeams,
}: TaskCreateFormProps) => {
  return (
    <Box
      sx={{
        flex: 1,
        justifyContent: "space-between",
        paddingBottom: Platform.select({ android: "$5" }),
      }}
    >
      <Box sx={{ gap: "$3", marginTop: "$5" }}>
        <Controller
          control={control}
          name="title"
          render={({ field }) => (
            <Input
              placeholder="Titulo"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.title && (
          <Text sx={{ color: "$red" }}>{errors.title.message}</Text>
        )}
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Input
              containerSx={{ height: 152, alignItems: "flex-start" }}
              sx={{ height: 152 }}
              multiline
              numberOfLines={6}
              placeholder="Descrição"
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.description && (
          <Text sx={{ color: "$red" }}>{errors.description.message}</Text>
        )}
        <Controller
          control={control}
          name="teamIds"
          render={({ field }) => (
            <TeamsSelect
              teams={teams}
              selectedIds={field.value ?? []}
              onChange={field.onChange}
              isLoading={isLoadingTeams}
              isLoadingMore={isLoadingMoreTeams}
              onEndReached={onLoadMoreTeams}
            />
          )}
        />
        {errors.teamIds && (
          <Text sx={{ color: "$red" }}>{errors.teamIds.message}</Text>
        )}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <TaskStatusSelect value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.status && (
          <Text sx={{ color: "$red" }}>{errors.status.message}</Text>
        )}
      </Box>
      <Box sx={{ gap: "$2" }}>
        {apiError && (
          <Text sx={{ color: "$red", textAlign: "center" }}>{apiError}</Text>
        )}
        <Button onPress={onSubmit} disabled={isSubmitting}>
          {isEdit ? "Salvar" : "Criar"}
        </Button>
      </Box>
    </Box>
  );
};
