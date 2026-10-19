import { deleteTask, findTaskById } from "@/services/tasks.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { tasksKeys } from "../constants/tasks";

export const useTaskDetail = (id?: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const taskQuery = useQuery({
    queryKey: tasksKeys.detail(id ?? 0),
    queryFn: () => findTaskById(id!),
    select: (response) => response.data,
    enabled: id !== undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      queryClient.removeQueries({ queryKey: tasksKeys.detail(taskId) });
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });

  const confirmDelete = async () => {
    if (id === undefined) return;
    try {
      await deleteMutation.mutateAsync(id);
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Não foi possível excluir a tarefa");
    }
  };

  const onDeletePress = () => {
    if (id === undefined || deleteMutation.isPending) return;
    Alert.alert("Excluir tarefa", "Deseja excluir esta tarefa?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: confirmDelete },
    ]);
  };

  return {
    task: taskQuery.data,
    isLoading: taskQuery.isPending,
    error: taskQuery.error,
    refetch: taskQuery.refetch,
    removeTask: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    onDeletePress,
  };
};
