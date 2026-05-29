import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-footer",
    standalone: true,
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
    imports: [RouterLink],
})
export class FooterComponent {
    date = new Date();
    year = this.date.getFullYear();
}
