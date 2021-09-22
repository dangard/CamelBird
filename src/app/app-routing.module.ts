import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccomplishmentsComponent } from './pages/accomplishments/accomplishments.component';
import { DevblogComponent } from './pages/devblog/devblog.component';
import { InterestsComponent } from './pages/interests/interests.component';

const routes: Routes = [
  { path: 'accomplishments', component: AccomplishmentsComponent },
  { path: 'interests', component: InterestsComponent },
  { path: 'devblog', component: DevblogComponent },
  { path: '',   redirectTo: '/accomplishments', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
