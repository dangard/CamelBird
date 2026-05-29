import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-admin-page-header",
    standalone: true,
    imports: [NgIf],
    templateUrl: "./admin-page-header.component.html",
    styleUrls: ["./admin-page-header.component.scss"],
})
export class AdminPageHeaderComponent {
    @Input({ required: true }) title!: string;
    @Input() createLabel: string | null = null;
    @Input() showCreate = false;

    @Output() create = new EventEmitter<void>();
}
