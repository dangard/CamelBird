import { TestBed } from "@angular/core/testing";

import { EventListenerService } from "./event-listener.service";

describe("EventListenerService", () => {
    let service: EventListenerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EventListenerService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should emit typed events to subscribers", () => {
        const received: unknown[] = [];
        const sub = service.events$.subscribe((e) => received.push(e));

        service.emit({ domain: "devblog", type: "created" });

        expect(received).toEqual([{ domain: "devblog", type: "created" }]);
        sub.unsubscribe();
    });
});
