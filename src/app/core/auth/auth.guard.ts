import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";

import { ADMIN_ROUTES } from "../auth.constants";
import { AuthService } from "../../shared/services/auth/auth.service";

export const authGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.isAuthenticated()) return true;

    const returnUrl =
        router.url && router.url !== ADMIN_ROUTES.LOGIN
            ? router.url
            : ADMIN_ROUTES.DASHBOARD;

    return router.createUrlTree([ADMIN_ROUTES.LOGIN], {
        queryParams: { returnUrl },
    });
};

export const guestGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) return true;

    return router.createUrlTree([ADMIN_ROUTES.DASHBOARD]);
};
