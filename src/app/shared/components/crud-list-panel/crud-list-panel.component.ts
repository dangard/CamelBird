import { NgIf, TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-crud-list-panel",
    standalone: true,
    imports: [NgIf, TitleCasePipe],
    templateUrl: "./crud-list-panel.component.html",
    styleUrls: ["./crud-list-panel.component.scss"],
})
export class CrudListPanelComponent {
    @Input() loading = false;
    @Input() errorMessage: string | null = null;
    @Input() emptyMessage = "No records yet.";
    @Input() emptyActionLabel: string | null = null;
    @Input() isEmpty = false;

    @Output() emptyAction = new EventEmitter<void>();
}
