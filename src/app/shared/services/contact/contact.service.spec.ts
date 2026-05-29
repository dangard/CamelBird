import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import { ContactService } from "./contact.service";

describe("ContactService", () => {
    let service: ContactService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient(), provideHttpClientTesting()],
        });
        service = TestBed.inject(ContactService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should POST contact payload to the API", () => {
        const payload = {
            subject: "General Question" as const,
            name: "Jane Doe",
            email: "jane@example.com",
            message: "Hello there",
            website: "",
        };

        service.sendContact(payload).subscribe((response) => {
            expect(response.message).toBe("Your message was sent.");
        });

        const req = httpMock.expectOne(
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.CONTACT.CREATE,
        );
        expect(req.request.method).toBe("POST");
        expect(req.request.body).toEqual(payload);
        req.flush({ message: "Your message was sent." });
    });
});
