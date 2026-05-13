import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FaceOffCritiqueComponent } from "./face-off-critique.component";

describe("FaceOffCritiqueComponent", () => {
    let component: FaceOffCritiqueComponent;
    let fixture: ComponentFixture<FaceOffCritiqueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FaceOffCritiqueComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FaceOffCritiqueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
