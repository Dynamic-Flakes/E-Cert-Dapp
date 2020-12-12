import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-image-file-preview',
  templateUrl: './image-file-preview.component.html',
  styleUrls: ['./image-file-preview.component.css']
})
export class ImageFilePreviewComponent implements OnInit, AfterViewInit {
  @Input() file;
  @Input() index;
  @Output() delete = new EventEmitter()
  base64Url = null;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.readerFileForPreview();
  }

  readerFileForPreview() {
    if (this.file) {
      let reader = new FileReader();

      reader.readAsDataURL(this.file);
      reader.onload = () => {
        this.base64Url = `${reader.result}`;
      }
      // console.log(this.base64Array)
    }
  }

  deleteAttachment(file) {
    if (file)
      this.delete.emit(file);
  }
}
