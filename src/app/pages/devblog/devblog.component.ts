import { Component, OnInit } from "@angular/core";
import { environment } from "../../../environments/environment";
import { DevblogListComponent } from "../../shared/components/devblog-list/devblog-list.component";
import { NgIf } from "@angular/common";
import { DevblogCreatorComponent } from "../../shared/components/devblog-creator/devblog-creator.component";

@Component({
    selector: "app-devblog",
    standalone: true,
    templateUrl: "./devblog.component.html",
    styleUrls: ["./devblog.component.scss"],
    imports: [DevblogListComponent, NgIf, DevblogCreatorComponent],
})
export class DevblogComponent implements OnInit {
    isCreateDevlogEnabled = false;

    ngOnInit(): void {
        this.isCreateDevlogEnabled = environment.enableDevlogCreate;
    }
}
