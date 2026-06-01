import { Injectable } from "@angular/core";

import { AUTH_STORAGE_KEYS } from "../auth.constants";
import type { StaffUser } from "../../shared/models/auth-api.types";

@Injectable({ providedIn: "root" })
export class TokenStore {
    getAccessToken(): string | null {
        return sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
    }

    getRefreshToken(): string | null {
        return sessionStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
    }

    getUser(): StaffUser | null {
        const raw = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as StaffUser;
        } catch {
            return null;
        }
    }

    setSession(
        accessToken: string,
        refreshToken: string,
        user: StaffUser,
    ): void {
        sessionStorage.setItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(user));
    }

    clear(): void {
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);
        sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER);
    }
}
