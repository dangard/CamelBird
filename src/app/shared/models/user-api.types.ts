import type { StaffRole, StaffUser } from "./auth-api.types";

export type UserRecord = StaffUser;

export interface UserCreateRequest {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    role?: StaffRole;
}

export interface UserPatchRequest {
    username?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    role?: StaffRole;
    is_active?: boolean;
    password?: string;
}
