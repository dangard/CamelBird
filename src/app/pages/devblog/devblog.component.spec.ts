import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { DevblogComponent } from "./devblog.component";

describe("DevblogComponent", () => {
    let component: DevblogComponent;
    let fixture: ComponentFixture<DevblogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DevblogComponent, RouterTestingModule],
            providers: [provideHttpClient()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DevblogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
