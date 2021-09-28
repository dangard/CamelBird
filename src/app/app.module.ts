import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { DevblogComponent } from './pages/devblog/devblog.component';
import { AccomplishmentsComponent } from './pages/accomplishments/accomplishments.component';
import { InterestsComponent } from './pages/interests/interests.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { DevblogListComponent } from './shared/components/devblog-list/devblog-list.component';
import { DevblogCreatorComponent } from './shared/components/devblog-creator/devblog-creator.component';

@NgModule({
    declarations: [AppComponent, DevblogComponent, AccomplishmentsComponent, InterestsComponent, HeaderComponent, FooterComponent, DevblogListComponent, DevblogCreatorComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
