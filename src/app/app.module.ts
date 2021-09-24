import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DevblogComponent } from './pages/devblog/devblog.component';
import { AccomplishmentsComponent } from './pages/accomplishments/accomplishments.component';
import { InterestsComponent } from './pages/interests/interests.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@NgModule({
    declarations: [AppComponent, DevblogComponent, AccomplishmentsComponent, InterestsComponent, HeaderComponent, FooterComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
