import { TestBed } from "@angular/core/testing";

import { LoggerService } from "./logger.service";

describe("LoggerService", () => {
    let service: LoggerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LoggerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should prefix error logs", () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => {});
        service.error("test", { code: 1 });
        expect(spy).toHaveBeenCalledWith("[CamelBird] test", { code: 1 });
        spy.mockRestore();
    });
});
