import { Tasks } from "@/models/task";
import {
  CreateTaskFormInput,
  CreateTaskFormSchema,
  createTaskSchema,
} from "@/schemas/tasks/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useTasks } from "./useTasks";

export const useCreateTask = (task?: Tasks) => {
  const router = useRouter();
  const { createTask, isCreating } = useTasks();

  const form = useForm<CreateTaskFormInput, unknown, CreateTaskFormSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title,
      description: task?.description,
      status: task?.status,
      teamIds: task?.teams.map((item) => item.id),
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createTask(values);
    router.back();
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting: isCreating,
    onSubmit,
  };
};
