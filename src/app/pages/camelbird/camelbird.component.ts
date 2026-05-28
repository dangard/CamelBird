import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { FaceOffCritiqueComponent } from "../../shared/components/face-off-critique/face-off-critique.component";

@Component({
    selector: "app-camelbird",
    standalone: true,
    imports: [RouterLink, FaceOffCritiqueComponent],
    templateUrl: "./camelbird.component.html",
    styleUrls: ["./camelbird.component.scss"],
})
export class CamelbirdComponent {}
