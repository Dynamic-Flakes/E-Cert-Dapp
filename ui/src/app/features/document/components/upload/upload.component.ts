import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { DynamicFormComponent } from 'src/app/shared/dynamic-form/dynamic-form.component';
import { FieldConfig } from 'src/app/shared/dynamic-form/models/field-config';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  busy = false;
  float_style = true;

  config: FieldConfig[] = [
    {
      type: 'filechooser',
      label: 'Drag and Drop Files',
      name: 'certificate',
      valueType: 'doc',
      size: '',
      validation: [Validators.required]
    },
    {
      label: 'Upload File',
      name: 'submit',
      type: 'button'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //setTimeout Prevent Change Detection Error
    setTimeout(() => {
      let previousValid = this.form.valid;
      this.form.changes.subscribe(() => {
        if (this.form.valid !== previousValid) {
          previousValid = this.form.valid;
          this.form.setDisabled('submit', !previousValid);
        }
      });

      this.form.setDisabled('submit', true);
    });
  }

  ngOnDestroy() {
  }

  submit(data: { [name: string]: any }) {
    this.busy = true;
    console.log(data)

  }
}
