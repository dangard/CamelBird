import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DevblogListComponent } from "./devblog-list.component";

describe("DevblogListComponent", () => {
    let component: DevblogListComponent;
    let fixture: ComponentFixture<DevblogListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DevblogListComponent],
            providers: [provideHttpClient()],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DevblogListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
