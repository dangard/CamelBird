import { NgIf } from "@angular/common";
import { Component, Input } from "@angular/core";

@Component({
    selector: "app-crud-list-panel",
    standalone: true,
    imports: [NgIf],
    templateUrl: "./crud-list-panel.component.html",
    styleUrls: ["./crud-list-panel.component.scss"],
})
export class CrudListPanelComponent {
    @Input() loading = false;
    @Input() errorMessage: string | null = null;
    @Input() emptyMessage = "No records yet.";
    @Input() isEmpty = false;
}
