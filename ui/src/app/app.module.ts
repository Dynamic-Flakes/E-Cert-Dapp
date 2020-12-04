import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JxToasterModule, JxToasterService } from "jx-toaster";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicFormModule } from './shared/dynamic-form/dynamic-form.module';
import { DocumentComponent } from './features/document/document.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { UploadComponent } from './features/document/components/upload/upload.component';
import { SearchComponent } from './features/document/components/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    DocumentComponent,
    MainLayoutComponent,
    UploadComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DynamicFormModule,
    JxToasterModule,
  ],
  providers: [
    JxToasterService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
