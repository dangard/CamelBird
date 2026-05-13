import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-interests",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./interests.component.html",
    styleUrls: ["./interests.component.scss"],
})
export class InterestsComponent {}
