import { Component } from "@angular/core";

@Component({
    selector: "app-footer",
    standalone: true,
    templateUrl: "./footer.component.html",
    styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {
    date = new Date();
    year = this.date.getFullYear();
}
