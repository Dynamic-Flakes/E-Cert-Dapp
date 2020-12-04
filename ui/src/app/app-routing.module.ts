import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './features/document/components/search/search.component';
import { UploadComponent } from './features/document/components/upload/upload.component';
import { DocumentComponent } from './features/document/document.component';

const routes: Routes = [
  { path: "", redirectTo: "cert", pathMatch: "full" },
  {
    path: 'cert', component: DocumentComponent, children: [
      { path: "", redirectTo: "upload", pathMatch: "full" },
      { path: 'upload', component: UploadComponent },
      { path: 'search', component: SearchComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
