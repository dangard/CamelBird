import { Routes } from "@angular/router";

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
        path: "**",
        loadComponent: () =>
            import("./pages/not-found/not-found.component").then(
                (m) => m.NotFoundComponent,
            ),
    },
];
