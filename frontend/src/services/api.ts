import { create as axiosCreate } from "axios";
import { Platform } from "react-native";

export const baseURL = Platform.select({
  ios: "http://localhost:3000",
  android: "http://10.0.2.2:3000",
});

export const httpClient = axiosCreate({ baseURL });
