import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  viewMode;
  title;

  constructor(private router: Router) {
    this.router.navigate(['/cert/upload']);
    this.viewMode = 'upload';
    this.updateTitle(this.viewMode);
  }

  ngOnInit(): void {
  }

  updateTitle(path) {
    if (path == 'upload') this.title = 'Upload';
    else if (path == 'verify') this.title = 'Verify';
    else return null;
  }
}
