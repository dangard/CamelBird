import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
    selector: "app-header",
    standalone: true,
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    imports: [RouterLink, RouterLinkActive],
})
export class HeaderComponent {
    title = "CamelBird";
    navCollapsed = true;

    toggleNav(): void {
        this.navCollapsed = !this.navCollapsed;
    }

    closeNav(): void {
        this.navCollapsed = true;
    }
}
