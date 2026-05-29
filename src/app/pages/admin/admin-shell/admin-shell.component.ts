import { AsyncPipe, NgIf } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";

import { ADMIN_ROUTES } from "../../../core/auth.constants";
import { AuthService } from "../../../shared/services/auth/auth.service";

@Component({
    selector: "app-admin-shell",
    standalone: true,
    imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
    templateUrl: "./admin-shell.component.html",
    styleUrls: ["admin-shell.component.scss"],
})
export class AdminShellComponent {
    readonly routes = ADMIN_ROUTES;
    readonly auth = inject(AuthService);

    signOut(): void {
        this.auth.logout();
    }
}
