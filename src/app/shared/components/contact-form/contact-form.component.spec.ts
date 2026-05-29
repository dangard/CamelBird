import {
    HttpTestingController,
    provideHttpClientTesting,
} from "@angular/common/http/testing";
import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ContactFormComponent } from "./contact-form.component";

describe("ContactFormComponent", () => {
    let component: ContactFormComponent;
    let fixture: ComponentFixture<ContactFormComponent>;
    let httpMock: HttpTestingController;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ContactFormComponent, ReactiveFormsModule, FormsModule],
            providers: [
                provideHttpClient(),
                provideHttpClientTesting(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: convertToParamMap({
                                subject: "resume-request",
                            }),
                        },
                    },
                },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactFormComponent);
        component = fixture.componentInstance;
        httpMock = TestBed.inject(HttpTestingController);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should pre-select Resume Request from query param", () => {
        expect(component.contactForm.get("subject")?.value).toBe(
            "Resume Request",
        );
    });

    it("should keep honeypot empty and include it in submit payload", () => {
        component.contactForm.patchValue({
            name: "Jane Doe",
            email: "jane@example.com",
            message: "Hello",
            website: "",
        });

        component.sendContact();

        const req = httpMock.expectOne((request) =>
            request.url.endsWith("/contact"),
        );
        expect(req.request.body.website).toBe("");
        req.flush({ message: "Your message was sent." });
        expect(component.submitted).toBe(true);
    });

    it("should not submit when required fields are missing", () => {
        component.contactForm.patchValue({
            name: "",
            email: "",
            message: "",
        });

        component.sendContact();

        httpMock.expectNone((request) => request.url.endsWith("/contact"));
    });
});
