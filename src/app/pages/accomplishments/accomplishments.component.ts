import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-accomplishments",
    standalone: true,
    templateUrl: "./accomplishments.component.html",
    styleUrls: ["./accomplishments.component.scss"],
    imports: [RouterLink],
})
export class AccomplishmentsComponent {}
