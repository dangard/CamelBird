import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DevblogCreatorComponent } from "./devblog-creator.component";

describe("DevblogCreatorComponent", () => {
    let component: DevblogCreatorComponent;
    let fixture: ComponentFixture<DevblogCreatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                DevblogCreatorComponent,
                ReactiveFormsModule,
                FormsModule,
            ],
            providers: [provideHttpClient()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DevblogCreatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
