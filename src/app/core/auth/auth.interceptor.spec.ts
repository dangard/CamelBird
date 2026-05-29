import {
    HttpClient,
    HttpContext,
    provideHttpClient,
    withInterceptors,
} from "@angular/common/http";
import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";

import { APP_CONSTANTS } from "../app.constants";
import { environment } from "../../../environments/environment";
import { AuthService } from "../../shared/services/auth/auth.service";
import { STAFF_DEVLOG_REQUEST } from "./auth-http.context";
import { authInterceptor } from "./auth.interceptor";

describe("authInterceptor", () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let getAccessToken: jest.Mock;

    const devlogsUrl =
        environment.apiUrl + APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL;

    beforeEach(() => {
        getAccessToken = jest.fn().mockReturnValue("test-token");
        TestBed.configureTestingModule({
            providers: [
                provideHttpClient(withInterceptors([authInterceptor])),
                provideHttpClientTesting(),
                {
                    provide: AuthService,
                    useValue: { getAccessToken },
                },
            ],
        });
        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("does not attach Bearer on anonymous GET /devlogs even when a token exists", () => {
        http.get(devlogsUrl).subscribe();
        const req = httpMock.expectOne(devlogsUrl);
        expect(req.request.headers.has("Authorization")).toBe(false);
        req.flush([]);
    });

    it("attaches Bearer on staff GET /devlogs when STAFF_DEVLOG_REQUEST is set", () => {
        http.get(devlogsUrl, {
            context: new HttpContext().set(STAFF_DEVLOG_REQUEST, true),
        }).subscribe();
        const req = httpMock.expectOne(devlogsUrl);
        expect(req.request.headers.get("Authorization")).toBe(
            "Bearer test-token",
        );
        req.flush([]);
    });

    it("attaches Bearer on POST /devlogs", () => {
        http.post(devlogsUrl, { title: "New post" }).subscribe();
        const req = httpMock.expectOne(devlogsUrl);
        expect(req.request.headers.get("Authorization")).toBe(
            "Bearer test-token",
        );
        req.flush({ log_id: "uuid" });
    });

    it("attaches Bearer on GET /users", () => {
        const usersUrl =
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.USERS.LIST;
        http.get(usersUrl).subscribe();
        const req = httpMock.expectOne(usersUrl);
        expect(req.request.headers.get("Authorization")).toBe(
            "Bearer test-token",
        );
        req.flush([]);
    });
});
