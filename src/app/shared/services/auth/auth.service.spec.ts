import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { AUTH_STORAGE_KEYS } from "../../../core/auth.constants";
import { TokenStore } from "../../../core/auth/token-store.service";
import { environment } from "../../../../environments/environment";
import { AuthService } from "./auth.service";

describe("AuthService", () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
    let tokenStore: TokenStore;

    beforeEach(() => {
        sessionStorage.clear();
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: Router,
                    useValue: { navigate: jest.fn() },
                },
            ],
        });
        service = TestBed.inject(AuthService);
        httpMock = TestBed.inject(HttpTestingController);
        tokenStore = TestBed.inject(TokenStore);
    });

    afterEach(() => {
        httpMock.verify();
        sessionStorage.clear();
    });

    it("stores session on login", () => {
        service
            .login({ username: "admin", password: "secret" })
            .subscribe((user) => {
                expect(user.username).toBe("admin");
            });

        const req = httpMock.expectOne(
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.AUTH.LOGIN,
        );
        req.flush({
            access_token: "access",
            refresh_token: "refresh",
            user: {
                id: 1,
                username: "admin",
                email: "admin@test.com",
                first_name: "Admin",
                last_name: "User",
                role: "admin",
                is_active: true,
            },
        });

        expect(tokenStore.getAccessToken()).toBe("access");
        expect(service.isAuthenticated()).toBe(true);
        expect(sessionStorage.getItem(AUTH_STORAGE_KEYS.ACCESS_TOKEN)).toBe(
            "access",
        );
    });
});
