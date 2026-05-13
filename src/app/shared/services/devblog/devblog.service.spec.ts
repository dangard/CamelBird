import { provideHttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";

import { DevblogService } from "./devblog.service";

describe("DevblogService", () => {
    let service: DevblogService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });
        service = TestBed.inject(DevblogService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
