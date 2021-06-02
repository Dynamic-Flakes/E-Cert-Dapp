import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { DynamicFieldDirective } from './directives/dynamic-field.directive';
import { DynamicFormComponent } from './dynamic-form.component';
import { DragDropDirective } from './directives/drag-drop.directive';
import { FormFilechooserComponent } from './components/form-filechooser/form-filechooser.component';
import { FormButtonComponent } from './components/form-button/form-button.component';
import { FormInputComponent } from './components/form-input/form-input.component';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFieldDirective,
    FormFilechooserComponent,
    DragDropDirective,
    FormButtonComponent,
    FormInputComponent,
  ],
  exports: [
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
    FormFilechooserComponent,
    FormButtonComponent,
    FormInputComponent,
  ],
  providers: [
  ]
})
export class DynamicFormModule { }
