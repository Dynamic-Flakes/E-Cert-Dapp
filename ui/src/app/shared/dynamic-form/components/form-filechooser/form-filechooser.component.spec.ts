import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFilechooserComponent } from './form-filechooser.component';

describe('FormFilechooserComponent', () => {
  let component: FormFilechooserComponent;
  let fixture: ComponentFixture<FormFilechooserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormFilechooserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFilechooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
