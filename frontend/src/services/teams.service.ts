import { ApiResponse, TeamFilterParams } from "@/models/api";
import { Teams } from "@/models/team";
import { httpClient } from "./api";

export type TeamsParams = {
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

export const findAllTeams = async (params?: TeamFilterParams) => {
  const response = await httpClient.get<ApiResponse<Teams[]>>("/v1/teams", {
    params,
  });

  return response.data;
};

export const findTeamById = async (id: number) => {
  const response = await httpClient.get<ApiResponse<Teams>>(`/v1/teams/${id}`);

  return response.data;
};

export const updateTeam = async (id: number, params: Partial<TeamsParams>) => {
  const response = await httpClient.patch<ApiResponse<Teams>>(
    `/v1/teams/${id}`,
    params,
  );

  return response.data;
};

export const deleteTeam = async (id: number) => {
  const response = await httpClient.delete<ApiResponse<void>>(
    `/v1/teams/${id}`,
  );

  return response.data;
};
