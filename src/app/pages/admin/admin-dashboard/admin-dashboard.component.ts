import { AsyncPipe, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";

import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
    selector: "app-admin-dashboard",
    standalone: true,
    imports: [AsyncPipe, NgIf],
    templateUrl: "./admin-dashboard.component.html",
})
export class AdminDashboardComponent {
    readonly auth = inject(AuthService);
}
