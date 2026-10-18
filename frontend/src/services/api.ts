import { create as axiosCreate } from "axios";
import Constants from "expo-constants";

const host = Constants.expoConfig?.hostUri?.split(":")[0] ?? "localhost";

export const baseURL = `http://${host}:3000`;

export const httpClient = axiosCreate({ baseURL });
