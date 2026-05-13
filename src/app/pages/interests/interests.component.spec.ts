import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { InterestsComponent } from "./interests.component";

describe("InterestsComponent", () => {
    let component: InterestsComponent;
    let fixture: ComponentFixture<InterestsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [InterestsComponent, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InterestsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
