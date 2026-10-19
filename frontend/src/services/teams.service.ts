import { ApiResponse, PaginationParams } from "@/models/api";
import { Teams } from "@/models/team";
import { httpClient } from "./api";

type TeamsParams = {
  name: string;
  color: string;
};

export const createTeams = async (params: TeamsParams) => {
  const response = await httpClient.post<ApiResponse<Teams>>(
    "/v1/teams",
    params,
  );

  return response.data;
};

export const findAllTeams = async (params?: PaginationParams) => {
  const response = await httpClient.get<ApiResponse<Teams[]>>("/v1/teams", {
    params,
  });

  return response.data;
};

export const findTeamById = async (id: number) => {
  const response = await httpClient.get<ApiResponse<Teams>>(`/v1/teams/${id}`);

  return response.data;
};

export const deleteTeam = async (id: number) => {
  const response = await httpClient.delete<ApiResponse<void>>(
    `/v1/teams/${id}`,
  );

  return response.data;
};
