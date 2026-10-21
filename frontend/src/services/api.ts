import { create as axiosCreate, isAxiosError } from "axios";
import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

const baseURL = `http://${host}:3000`;

export const httpClient = axiosCreate({ baseURL });

type ApiErrorBody = {
  error?: { code?: string; message?: string; details?: unknown };
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError<ApiErrorBody>(error)) return fallback;
  if (!error.response) return "Não foi possível conectar à API";

  const body = error.response.data?.error;
  const details = Array.isArray(body?.details)
    ? body.details.filter((item): item is string => typeof item === "string")
    : [];
  if (details.length > 0) return details.join("\n");
  return body?.message ?? fallback;
};
