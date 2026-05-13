import { Component, OnInit } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-header",
    standalone: true,
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
    imports: [RouterLink, RouterLinkActive, NgIf],
})
export class HeaderComponent implements OnInit {
    title = "CamelBird";
    isDevBlogEnabled = false;

    ngOnInit(): void {
        this.isDevBlogEnabled = environment.enableDevBlog;
    }
}
