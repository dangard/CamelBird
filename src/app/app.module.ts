import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { github, linkedin } from 'ngx-bootstrap-icons';
import { DevblogComponent } from './pages/devblog/devblog.component';
import { AccomplishmentsComponent } from './pages/accomplishments/accomplishments.component';
import { InterestsComponent } from './pages/interests/interests.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DevblogListComponent } from './shared/components/devblog-list/devblog-list.component';
import { DevblogCreatorComponent } from './shared/components/devblog-creator/devblog-creator.component';
import { FaceOffCritiqueComponent } from './shared/components/face-off-critique/face-off-critique.component';
import { CamelbirdComponent } from './pages/camelbird/camelbird.component';


const icons = {
  github,
  linkedin
};

@NgModule({
    declarations: [AppComponent, DevblogComponent, AccomplishmentsComponent, InterestsComponent, HeaderComponent, FooterComponent, DevblogListComponent, DevblogCreatorComponent, FaceOffCritiqueComponent, CamelbirdComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule, ReactiveFormsModule, NgxBootstrapIconsModule.pick(icons)],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
