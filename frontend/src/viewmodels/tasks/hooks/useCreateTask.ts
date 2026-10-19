import { Tasks } from "@/models/task";
import {
  CreateTaskFormInput,
  CreateTaskFormSchema,
  createTaskSchema,
} from "@/schemas/task.schema";
import { createTasks, updateTask } from "@/services/tasks.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { tasksKeys } from "../constants/tasks";

export const useCreateTask = (task?: Tasks) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEdit = task !== undefined;

  const form = useForm<CreateTaskFormInput, unknown, CreateTaskFormSchema>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? undefined,
      status: task?.status,
      teamIds: task?.teams.map((item) => item.id),
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values: CreateTaskFormSchema) =>
      task ? updateTask(task.id, values) : createTasks(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
      if (task) {
        queryClient.invalidateQueries({ queryKey: tasksKeys.detail(task.id) });
      }
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await saveMutation.mutateAsync(values);
    router.back();
  });

  return {
    control: form.control,
    errors: form.formState.errors,
    isSubmitting: saveMutation.isPending,
    isEdit,
    onSubmit,
  };
};
