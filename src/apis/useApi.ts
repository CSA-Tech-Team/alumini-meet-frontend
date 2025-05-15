import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { HttpMethod } from "./apis.enum";
import { ApiConfig } from "./apis.interface";
import { localStorageService } from "../services/localStorage.service";

const fetchApi = async <TRequest>({ method, url, auth, body, params }: ApiConfig & { body?: TRequest }) => {
  const config: AxiosRequestConfig = {
    method,
    url,
    headers: auth ? { Authorization: `Bearer ${localStorageService.getItem<string>("access_token")}` } : {},
    data: body,
    params,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorageService.removeItem("access_token");
      window.location.href = "/home";
    }
    throw error;
  }
};

export const useApi = <TResponse, TRequest = void>(
  method: HttpMethod,
  auth: boolean,
  key: string,
  config: Omit<ApiConfig, "method" | "auth">
): UseQueryResult<TResponse, Error> | UseMutationResult<TResponse, Error, TRequest, unknown> => {
  if (method === HttpMethod.GET) {
    return useQuery<TResponse, Error>({
      queryKey: [key, config],
      queryFn: () => fetchApi<TRequest>({ method, auth, ...config }),
    }) as UseQueryResult<TResponse, Error>;
  } else {
    return useMutation<TResponse, Error, TRequest>({
      mutationFn: (data: TRequest) => fetchApi<TRequest>({ method, auth, body: data, ...config }),
    }) as UseMutationResult<TResponse, Error, TRequest, unknown>;
  }
};