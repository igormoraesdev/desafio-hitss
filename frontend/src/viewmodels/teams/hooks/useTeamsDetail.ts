import { deleteTeam, findTeamById } from "@/services/teams.service";
import { tasksKeys } from "@/viewmodels/tasks/constants/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { teamsKeys } from "../constants/teams";

export const useTeamsDetail = (id?: number) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const teamQuery = useQuery({
    queryKey: teamsKeys.detail(id ?? 0),
    queryFn: () => findTeamById(id!),
    select: (response) => response.data,
    enabled: id !== undefined,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: (_, teamId) => {
      queryClient.removeQueries({ queryKey: teamsKeys.detail(teamId) });
      queryClient.invalidateQueries({ queryKey: teamsKeys.all });
      queryClient.invalidateQueries({ queryKey: tasksKeys.all });
    },
  });

  const confirmDelete = async () => {
    if (id === undefined) return;
    try {
      await deleteMutation.mutateAsync(id);
      router.back();
    } catch {
      Alert.alert("Erro", "Não foi possível excluir o time");
    }
  };

  const onDeletePress = () => {
    if (id === undefined || deleteMutation.isPending) return;
    Alert.alert(
      "Excluir time",
      "As tarefas deste time não serão excluídas, apenas desvinculadas. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: confirmDelete },
      ],
    );
  };

  return {
    team: teamQuery.data,
    isLoading: teamQuery.isPending,
    error: teamQuery.error,
    refetch: teamQuery.refetch,
    removeTeam: deleteMutation.mutateAsync,
    isRemoving: deleteMutation.isPending,
    onDeletePress,
  };
};
