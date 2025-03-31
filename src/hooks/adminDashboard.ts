// adminDashboard.ts
import { useApi } from "@/apis/useApi";
import { ApiEndpoints, HttpMethod } from "@/apis/apis.enum";
import { UseQueryResult } from "@tanstack/react-query";
import {
    FoodPreferenceCountResponse,
    GenderCountResponse,
    GradYearCountResponse,
    AllUsersResponse,
} from "@/apis/apis.interface";

// Fetch food preference count
export const useFoodPreferenceCount = (): UseQueryResult<FoodPreferenceCountResponse, Error> => {
    return useApi<FoodPreferenceCountResponse>(
        HttpMethod.GET,
        true,
        "foodPreferenceCount",
        { url: ApiEndpoints.FOOD_PREFERENCE_COUNT }
    ) as UseQueryResult<FoodPreferenceCountResponse, Error>;
};

// Fetch gender count
export const useGenderCount = (): UseQueryResult<GenderCountResponse, Error> => {
    return useApi<GenderCountResponse>(
        HttpMethod.GET,
        true,
        "genderCount",
        { url: ApiEndpoints.GENDER_COUNT }
    ) as UseQueryResult<GenderCountResponse, Error>;
};

// Fetch graduation year count
export const useGradYearCount = (): UseQueryResult<GradYearCountResponse, Error> => {
    return useApi<GradYearCountResponse>(
        HttpMethod.GET,
        true,
        "gradYearCount",
        { url: ApiEndpoints.GRAD_YEAR_COUNT }
    ) as UseQueryResult<GradYearCountResponse, Error>;
};

// Fetch all users
export const useAllUsers = (): UseQueryResult<AllUsersResponse[], Error> => {
    return useApi<AllUsersResponse[]>(
        HttpMethod.GET,
        false,
        "allUsers",
        { url: ApiEndpoints.ALL_USERS }
    ) as UseQueryResult<AllUsersResponse[], Error>;
};
