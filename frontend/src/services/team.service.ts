import { ApiResponse } from "@/models/api";
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

export const findAllTeams = async () => {
  const response = await httpClient.get<ApiResponse<Teams[]>>("/v1/teams");

  return response.data;
};

export const findTeamById = async (id: string) => {
  const response = await httpClient.get<ApiResponse<Teams>>(`/v1/teams/${id}`);

  return response.data;
};

export const updateTeam = async (params: TeamsParams, id: number) => {
  const response = await httpClient.patch<ApiResponse<void>>(
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
