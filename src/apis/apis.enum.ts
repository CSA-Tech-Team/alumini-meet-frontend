const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not defined in the .env file. Check if you have the .env file");
}

export enum HttpMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    PUT = "PUT",
    DELETE = "DELETE",
}

export const ApiEndpoints = {
    TODOS: `https://jsonplaceholder.typicode.com/todos`,
    POSTS: `https://jsonplaceholder.typicode.com/posts`,
    SIGNUP: `${BASE_URL}/auth/signup`,
    VERIFY_OTP: `${BASE_URL}/auth/verifyotp`,
    LOGIN: `${BASE_URL}/auth/signin`,
};
