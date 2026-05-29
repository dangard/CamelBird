import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    map,
    throwError,
} from "rxjs";

import { APP_CONSTANTS } from "../../../core/app.constants";
import {
    ADMIN_ROUTES,
    AUTH_REFRESH_MAX_ATTEMPTS,
} from "../../../core/auth.constants";
import { TokenStore } from "../../../core/auth/token-store.service";
import { environment } from "../../../../environments/environment";
import type {
    AuthLoginRequest,
    AuthRefreshRequest,
    AuthTokenResponse,
    StaffUser,
} from "../../models/auth-api.types";

@Injectable({ providedIn: "root" })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly tokenStore = inject(TokenStore);
    private readonly router = inject(Router);

    private readonly currentUserSubject = new BehaviorSubject<StaffUser | null>(
        this.tokenStore.getUser(),
    );

    readonly currentUser$ = this.currentUserSubject.asObservable();

    private refreshInFlight: Observable<AuthTokenResponse> | null = null;
    private refreshAttempts = 0;

    get apiBase(): string {
        return environment.apiUrl;
    }

    isAuthenticated(): boolean {
        return !!this.tokenStore.getAccessToken();
    }

    getAccessToken(): string | null {
        return this.tokenStore.getAccessToken();
    }

    getCurrentUser(): StaffUser | null {
        return this.currentUserSubject.value;
    }

    login(credentials: AuthLoginRequest): Observable<StaffUser> {
        return this.http
            .post<AuthTokenResponse>(
                this.apiBase + APP_CONSTANTS.OPERATIONS.AUTH.LOGIN,
                credentials,
            )
            .pipe(map((response) => this.applySession(response)));
    }

    refresh(): Observable<AuthTokenResponse> {
        const refreshToken = this.tokenStore.getRefreshToken();
        if (!refreshToken)
            return throwError(() => new Error("No refresh token"));

        if (this.refreshInFlight) return this.refreshInFlight;

        const body: AuthRefreshRequest = { refresh_token: refreshToken };
        this.refreshInFlight = this.http
            .post<AuthTokenResponse>(
                this.apiBase + APP_CONSTANTS.OPERATIONS.AUTH.REFRESH,
                body,
            )
            .pipe(
                map((response) => {
                    this.applySession(response);
                    this.refreshAttempts = 0;
                    return response;
                }),
                catchError((err) => {
                    this.refreshAttempts += 1;
                    if (this.refreshAttempts >= AUTH_REFRESH_MAX_ATTEMPTS)
                        this.logout();

                    return throwError(() => err);
                }),
                finalize(() => {
                    this.refreshInFlight = null;
                }),
            );

        return this.refreshInFlight;
    }

    logout(): void {
        this.tokenStore.clear();
        this.currentUserSubject.next(null);
        this.refreshAttempts = 0;
        void this.router.navigate([ADMIN_ROUTES.LOGIN]);
    }

    applySession(response: AuthTokenResponse): StaffUser {
        this.tokenStore.setSession(
            response.access_token,
            response.refresh_token,
            response.user,
        );
        this.currentUserSubject.next(response.user);
        return response.user;
    }
}
