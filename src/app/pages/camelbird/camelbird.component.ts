import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-camelbird",
    standalone: true,
    imports: [RouterLink],
    templateUrl: "./camelbird.component.html",
    styleUrls: ["./camelbird.component.scss"],
})
export class CamelbirdComponent {}
