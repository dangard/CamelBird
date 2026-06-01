import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { APP_CONSTANTS } from "../../../core/app.constants";
import { environment } from "../../../../environments/environment";
import type {
    ContactRequest,
    ContactResponse,
} from "../../models/contact-api.types";

@Injectable({
    providedIn: "root",
})
export class ContactService {
    constructor(private http: HttpClient) {}

    public sendContact(payload: ContactRequest): Observable<ContactResponse> {
        return this.http.post<ContactResponse>(
            environment.apiUrl + APP_CONSTANTS.OPERATIONS.CONTACT.CREATE,
            payload,
        );
    }
}
