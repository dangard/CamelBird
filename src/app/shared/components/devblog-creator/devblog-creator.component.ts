import { Component, OnInit } from "@angular/core";
import {
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { DevblogService } from "../../services/devblog/devblog.service";
import { Devblog } from "../../models/Devblog";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-devblog-creator",
    standalone: true,
    templateUrl: "./devblog-creator.component.html",
    styleUrls: ["./devblog-creator.component.scss"],
    imports: [FormsModule, ReactiveFormsModule, NgIf],
})
export class DevblogCreatorComponent implements OnInit {
    devBlog = new Devblog("", "", "dangard");

    devblogForm!: UntypedFormGroup;

    ngOnInit(): void {
        this.devblogForm = new UntypedFormGroup({
            title: new UntypedFormControl(this.devBlog.title, [
                Validators.required,
            ]),
            body: new UntypedFormControl(this.devBlog.body, [
                Validators.required,
            ]),
        });
    }

    createDevblog() {
        const formData = this.devblogForm.value;
        this.devBlog = new Devblog(formData.title, formData.body, "dangard");
        this.dataService.createDevBlog(this.devBlog.convertToJson());
        this.devBlog = new Devblog("", "", "dangard");
    }

    get title() {
        return this.devblogForm.get("title")!;
    }

    get body() {
        return this.devblogForm.get("body")!;
    }

    constructor(public dataService: DevblogService) {}
}
