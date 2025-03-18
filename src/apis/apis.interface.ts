import { HttpMethod } from "./apis.enum";

export interface ApiConfig {
    method: HttpMethod;
    url: string;
    auth?: boolean;
    body?: any;
    params?: Record<string, any>;
}


// Request DTO for Signup
export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    addr: string;
    course: string;
    designation: string;
    gender: string;
    gradyear: number;
    rollno: string;
    phonenumber: string;
}


// Response DTO for Signup
export interface SignupResponse {
    message: string;
    profile: {
        id: string;
        userId: string;
        createdAt: string;
        updatedAt: string;
        name: string;
        email: string;
        gender: string;
        rollNumber: string;
        phoneNumber: string;
        designation: string;
        graduationYear: number;
        address: string;
        course: string;
    };
}
