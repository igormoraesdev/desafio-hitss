import { ApiResponse, FilterParams } from "@/models/api";
import { Tasks, TaskStatusKey } from "@/models/task";
import { httpClient } from "./api";

type TasksParams = {
  title: string;
  description?: string;
  status?: TaskStatusKey;
  teamIds?: number[];
};

export const createTasks = async (params: TasksParams) => {
  const response = await httpClient.post<ApiResponse<Tasks>>(
    "/v1/tasks",
    params,
  );

  return response.data;
};

export const findAllTasks = async (params: FilterParams) => {
  const response = await httpClient.get<ApiResponse<Tasks[]>>("/v1/tasks", {
    params,
  });

  return response.data;
};

export const findTaskById = async (id: number) => {
  const response = await httpClient.get<ApiResponse<Tasks>>(`/v1/tasks/${id}`);

  return response.data;
};

export const deleteTask = async (id: number) => {
  const response = await httpClient.delete<ApiResponse<void>>(
    `/v1/tasks/${id}`,
  );

  return response.data;
};
