import { Routes } from "@angular/router";

import { authGuard, guestGuard } from "./core/auth/auth.guard";

export const routes: Routes = [
    { path: "", redirectTo: "/accomplishments", pathMatch: "full" },
    {
        path: "accomplishments",
        loadComponent: () =>
            import("./pages/accomplishments/accomplishments.component").then(
                (m) => m.AccomplishmentsComponent,
            ),
    },
    {
        path: "interests",
        loadComponent: () =>
            import("./pages/interests/interests.component").then(
                (m) => m.InterestsComponent,
            ),
    },
    {
        path: "devblog",
        loadComponent: () =>
            import("./pages/devblog/devblog.component").then(
                (m) => m.DevblogComponent,
            ),
    },
    {
        path: "camelbird",
        loadComponent: () =>
            import("./pages/camelbird/camelbird.component").then(
                (m) => m.CamelbirdComponent,
            ),
    },
    {
        path: "contact",
        loadComponent: () =>
            import("./pages/contact/contact.component").then(
                (m) => m.ContactComponent,
            ),
    },
    {
        path: "admin/login",
        canActivate: [guestGuard],
        loadComponent: () =>
            import("./pages/admin/admin-login/admin-login.component").then(
                (m) => m.AdminLoginComponent,
            ),
    },
    {
        path: "admin",
        canActivate: [authGuard],
        loadComponent: () =>
            import("./pages/admin/admin-shell/admin-shell.component").then(
                (m) => m.AdminShellComponent,
            ),
        children: [
            { path: "", redirectTo: "dashboard", pathMatch: "full" },
            {
                path: "dashboard",
                loadComponent: () =>
                    import("./pages/admin/admin-dashboard/admin-dashboard.component").then(
                        (m) => m.AdminDashboardComponent,
                    ),
            },
            {
                path: "users",
                loadComponent: () =>
                    import("./pages/admin/admin-users/admin-users.component").then(
                        (m) => m.AdminUsersComponent,
                    ),
            },
            {
                path: "devlogs",
                loadComponent: () =>
                    import("./pages/admin/admin-devlogs/admin-devlogs.component").then(
                        (m) => m.AdminDevlogsComponent,
                    ),
            },
        ],
    },
    {
        path: "**",
        loadComponent: () =>
            import("./pages/not-found/not-found.component").then(
                (m) => m.NotFoundComponent,
            ),
    },
];
