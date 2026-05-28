import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
    let component: HeaderComponent;
    let fixture: ComponentFixture<HeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [HeaderComponent, RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'CamelBird'`, () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual("CamelBird");
    });

    it("should render title", () => {
        const fixture = TestBed.createComponent(HeaderComponent);
        fixture.detectChanges();
        const compiled = fixture.nativeElement as HTMLElement;
        expect(
            compiled.querySelector(".navbar .navbar-brand")?.textContent,
        ).toContain("CamelBird.com");
    });

    it("should toggle nav collapsed state", () => {
        expect(component.navCollapsed).toBe(true);
        component.toggleNav();
        expect(component.navCollapsed).toBe(false);
        component.closeNav();
        expect(component.navCollapsed).toBe(true);
    });
});
