import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HeaderComponent } from "./shared/components/header/header.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"],
})
export class AppComponent {
    date = new Date();
    year = this.date.getFullYear();
}
