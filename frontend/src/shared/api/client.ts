import axios, { type AxiosRequestConfig } from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiRequest = async <ResponseData>(
  config: AxiosRequestConfig,
): Promise<ResponseData> => {
  const response = await apiClient.request<ResponseData>(config);

  return response.data;
};
