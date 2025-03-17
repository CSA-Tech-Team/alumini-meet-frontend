import { HttpMethod } from "./apis.enum";

export interface ApiConfig {
    method: HttpMethod;
    url: string;
    auth?: boolean;
    body?: any;
    params?: Record<string, any>;
}
