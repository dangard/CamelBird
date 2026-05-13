import { Routes } from "@angular/router";
import { AccomplishmentsComponent } from "./pages/accomplishments/accomplishments.component";
import { CamelbirdComponent } from "./pages/camelbird/camelbird.component";
import { DevblogComponent } from "./pages/devblog/devblog.component";
import { InterestsComponent } from "./pages/interests/interests.component";

export const routes: Routes = [
    { path: "", redirectTo: "/accomplishments", pathMatch: "full" },
    { path: "accomplishments", component: AccomplishmentsComponent },
    { path: "interests", component: InterestsComponent },
    { path: "devblog", component: DevblogComponent },
    { path: "camelbird", component: CamelbirdComponent },
];
