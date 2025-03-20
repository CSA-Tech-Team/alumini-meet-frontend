import { useQuery, useMutation, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { HttpMethod } from "./apis.enum";
import { ApiConfig } from "./apis.interface";
import { localStorageService } from "../services/localStorage.service";

const fetchApi = async <TRequest>({ method, url, auth, body, params }: ApiConfig & { body?: TRequest }) => {
    // Define the headers based on whether authentication is required
    const config: AxiosRequestConfig = {
        method,
        url,
        headers: auth ? { Authorization: `Bearer ${localStorageService.getItem<string>("access_token")}` } : {},
        data: body,
        params,
    };

    // Perform the API request using Axios
    const response = await axios(config);
    return response.data;  // Return the response data from the API
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
            queryFn: () => fetchApi<TRequest>({ method, auth, ...config }),  // Use the fetchApi function for GET requests
        }) as UseQueryResult<TResponse, Error>;
    } else {
        return useMutation<TResponse, Error, TRequest>({
            mutationFn: (data: TRequest) => fetchApi<TRequest>({ method, auth, body: data, ...config }),  // Use the fetchApi function for other methods
        }) as UseMutationResult<TResponse, Error, TRequest, unknown>;
    }
};
