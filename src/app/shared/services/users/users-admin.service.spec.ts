import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import { UsersAdminService } from "./users-admin.service";

describe("UsersAdminService", () => {
    let service: UsersAdminService;
    let httpMock: HttpTestingController;

    const usersUrl = environment.apiUrl + APP_CONSTANTS.OPERATIONS.USERS.LIST;

    const userPublic = {
        id: 2,
        username: "jane",
        email: "jane@camelbird.com",
        first_name: "Jane",
        last_name: "Doe",
        role: "read_only" as const,
        is_active: true,
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(UsersAdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("create() returns UserPublic", () => {
        service
            .create({
                username: "jane",
                email: "jane@camelbird.com",
                password: "secret123",
            })
            .subscribe((user) => {
                expect(user).toEqual(userPublic);
            });

        const req = httpMock.expectOne(usersUrl);
        expect(req.request.method).toBe("POST");
        req.flush(userPublic);
    });

    it("patch() returns UserPublic", () => {
        const patchUrl =
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.USERS.BY_ID(2);

        service.patch(2, { is_active: false }).subscribe((user) => {
            expect(user.is_active).toBe(false);
        });

        const req = httpMock.expectOne(patchUrl);
        expect(req.request.method).toBe("PATCH");
        req.flush({ ...userPublic, is_active: false });
    });

    it("delete() sends DELETE", () => {
        const deleteUrl =
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.USERS.BY_ID(2);

        service.delete(2).subscribe();

        const req = httpMock.expectOne(deleteUrl);
        expect(req.request.method).toBe("DELETE");
        req.flush(null);
    });
});
