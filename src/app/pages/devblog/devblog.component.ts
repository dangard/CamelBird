import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

import { DevblogListComponent } from "../../shared/components/devblog-list/devblog-list.component";

@Component({
    selector: "app-devblog",
    standalone: true,
    templateUrl: "./devblog.component.html",
    styleUrls: ["./devblog.component.scss"],
    imports: [DevblogListComponent, RouterLink],
})
export class DevblogComponent {}
