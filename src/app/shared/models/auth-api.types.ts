export type StaffRole = "admin" | "read_only" | "maintainer";

export interface StaffUser {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: StaffRole;
    is_active: boolean;
}

export interface AuthLoginRequest {
    username: string;
    password: string;
}

export interface AuthTokenResponse {
    access_token: string;
    refresh_token: string;
    user: StaffUser;
}

export interface AuthRefreshRequest {
    refresh_token: string;
}

export interface MessageResponse {
    message: string;
}

export interface ForbiddenResponse {
    message: string;
    code: "INSUFFICIENT_ROLE";
}

export interface ValidationErrorResponse {
    message: string;
    errors: Record<string, string>;
}

export type ApiErrorBody = Partial<
    MessageResponse & ForbiddenResponse & ValidationErrorResponse
>;
