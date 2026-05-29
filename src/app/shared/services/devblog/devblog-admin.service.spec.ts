import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { STAFF_DEVLOG_REQUEST } from "../../../core/auth/auth-http.context";
import { environment } from "../../../../environments/environment";
import { DevblogAdminService } from "./devblog-admin.service";

describe("DevblogAdminService", () => {
    let service: DevblogAdminService;
    let httpMock: HttpTestingController;

    const devlogsUrl =
        environment.apiUrl + APP_CONSTANTS.OPERATIONS.DEVBLOG.GET_ALL;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(DevblogAdminService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("list() requests staff devlogs with STAFF_DEVLOG_REQUEST context", () => {
        service.list().subscribe((rows) => {
            expect(rows).toHaveLength(1);
            expect(rows[0].is_published).toBe(false);
        });

        const req = httpMock.expectOne(devlogsUrl);
        expect(req.request.method).toBe("GET");
        expect(req.request.context.get(STAFF_DEVLOG_REQUEST)).toBe(true);
        req.flush([
            {
                id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
                title: "Draft",
                body: "Work in progress",
                date: "2026-05-29 10:00:00",
                user: "admin",
                is_published: false,
            },
        ]);
    });

    it("patch() returns DevlogStaff", () => {
        const id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
        const patchUrl =
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.DEVBLOG.BY_ID(id);

        service.patch(id, { is_published: true }).subscribe((entry) => {
            expect(entry.is_published).toBe(true);
            expect(entry.user).toBe("admin");
        });

        const req = httpMock.expectOne(patchUrl);
        expect(req.request.method).toBe("PATCH");
        expect(req.request.body).toEqual({ is_published: true });
        req.flush({
            id,
            title: "Draft",
            body: "Work in progress",
            date: "2026-05-29 10:00:00",
            user: "admin",
            is_published: true,
        });
    });
});
