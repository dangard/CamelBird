import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

import type { CamelBirdAppEvent } from "../../models/app-events.types";

@Injectable({
    providedIn: "root",
})
export class EventListenerService {
    private readonly subject = new Subject<CamelBirdAppEvent>();

    readonly events$: Observable<CamelBirdAppEvent> =
        this.subject.asObservable();

    emit(event: CamelBirdAppEvent): void {
        this.subject.next(event);
    }
}
