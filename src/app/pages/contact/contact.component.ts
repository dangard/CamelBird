import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { ContactFormComponent } from "../../shared/components/contact-form/contact-form.component";

@Component({
    selector: "app-contact",
    standalone: true,
    templateUrl: "./contact.component.html",
    styleUrls: ["./contact.component.scss"],
    imports: [ContactFormComponent, RouterLink],
})
export class ContactComponent {}
