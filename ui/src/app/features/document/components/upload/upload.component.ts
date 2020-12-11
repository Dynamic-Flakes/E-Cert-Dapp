import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { DocumentService } from 'src/app/services/document.service';
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
      label: 'Hash & Save',
      name: 'submit',
      type: 'button'
    }
  ];

  constructor(private $doc: DocumentService) { }

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

    let _hash1 = 'd63a75de5f66284087098fd85381f01ff61d4374f1e05f3e5dd0775e204d605c';
    let _hash2 = `0x${_hash1}`;

    console.log(_hash2)

    this.$doc.saveHash(_hash2).
      then(function () { }).catch(function (error) {
        console.log(error);
        console.log('Errorrrrrr!!!!');
      });
  }
}
