import { NgIf } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { environment } from "../../../environments/environment";
import { DevblogCreatorComponent } from "../../shared/components/devblog-creator/devblog-creator.component";
import { DevblogListComponent } from "../../shared/components/devblog-list/devblog-list.component";

@Component({
    selector: "app-devblog",
    standalone: true,
    templateUrl: "./devblog.component.html",
    styleUrls: ["./devblog.component.scss"],
    imports: [DevblogListComponent, NgIf, DevblogCreatorComponent, RouterLink],
})
export class DevblogComponent implements OnInit {
    isCreateDevlogEnabled = false;

    ngOnInit(): void {
        this.isCreateDevlogEnabled = environment.enableDevlogCreate;
    }
}
