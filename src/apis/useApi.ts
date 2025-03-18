import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { HttpMethod } from "./apis.enum";
import { ApiConfig } from "./apis.interface";
import { localStorageService } from "../services/localStorage.service";

const fetchApi = async ({ method, url, auth, body, params }: ApiConfig) => {
    const config: AxiosRequestConfig = {
        method,
        url,
        headers: auth ? { Authorization: `Bearer ${localStorageService.getItem<string>("token")}` } : {},
        data: body,
        params,
    };

    const response = await axios(config);
    return response.data;
};

// Ensure correct return type
export const useApi = <T = unknown>(
    method: HttpMethod,
    auth: boolean,
    key: string,
    config: Omit<ApiConfig, "method" | "auth">
): UseQueryResult<T, Error> | UseMutationResult<T, Error, void, unknown> => {
    if (method === HttpMethod.GET) {
        return useQuery<T, Error>({
            queryKey: [key, config],
            queryFn: () => fetchApi({ method, auth, ...config }),
        }) as UseQueryResult<T, Error>;
    } else {
        return useMutation<T, Error, void>({
            mutationFn: () => fetchApi({ method, auth, ...config }),
        }) as UseMutationResult<T, Error, void, unknown>;
    }
};
