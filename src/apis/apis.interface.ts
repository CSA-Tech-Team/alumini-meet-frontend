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
    isProfileCompleted: boolean;
}


// Course Enum
export enum Course {
    SOFTWARE_SYSTEMS = "SOFTWARESYSTEMS",
    CYBER_SECURITY = "CYBERSECURITY",
    DATA_SCIENCE = "DATASCIENCE",
    THEORETICAL_COMPUTER_SCIENCE = "THEORETICALCOMPUTER_SCIENCE",
    APPLIED_MATHEMATICS = "APPLIEDMATHEMATICS",
}


export interface VerifyOtpRequest {
    email: string;
    otp: string;
}


export interface VerifyOtpResponse {
    message?: string;
    access_token?: string;
}


export interface SignInRequest {
    email: string;
    password: string;
}

export interface SignInResponse {
    message: string;
    access_token: string;
    isProfileCompleted?: boolean;
}


// Enum for Food Preference
export enum FoodPreference {
    VEG = "Veg",
    NON_VEG = "NonVeg",
}

// Interface for Profile Update Request
export interface ProfileUpdateRequest {
    foodPreference: FoodPreference;
    addr: string;
    course: Course;
    designation: string;
    gender: string;
    gradyear: number;
    rollno: string;
    phonenumber: string;
}

// Interface for Profile Update Response
export interface ProfileUpdateResponse {
    message: string;
    isProfileComplete: boolean;
}

export interface Event {
    id: string;
    createdAt: string;
    updatedAt: string;
    eventName: string;
    about: string;
}

export type GetAllEventsResponse = Event[];


export interface RegisterEventResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    eventId: string;
    userId: string;
  }

  export interface GetUserActivitiesResponse {
    id: string;
    createdAt: string;
    updatedAt: string;
    eventId: string;
    userId: string;
    event: {
      id: string;
      createdAt: string;
      updatedAt: string;
      eventName: string;
      about: string;
    };
  }

  