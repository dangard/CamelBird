import { NgIf } from "@angular/common";
import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    Output,
} from "@angular/core";

@Component({
    selector: "app-admin-form-modal",
    standalone: true,
    imports: [NgIf],
    templateUrl: "./admin-form-modal.component.html",
    styleUrls: ["./admin-form-modal.component.scss"],
})
export class AdminFormModalComponent {
    @Input({ required: true }) title!: string;
    @Input({ required: true }) titleId!: string;
    @Input({ required: true }) submitLabel!: string;
    @Input() open = false;
    @Input() submitDisabled = false;
    @Input() formError: string | null = null;

    @Output() closed = new EventEmitter<void>();
    @Output() submitted = new EventEmitter<void>();

    @HostListener("document:keydown.escape")
    onEscape(): void {
        if (this.open) this.closed.emit();
    }

    onSubmit(event: SubmitEvent): void {
        event.preventDefault();
        this.submitted.emit();
    }
}
