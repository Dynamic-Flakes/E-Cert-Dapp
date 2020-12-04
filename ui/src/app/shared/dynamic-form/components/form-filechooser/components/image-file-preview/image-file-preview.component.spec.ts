import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFilePreviewComponent } from './image-file-preview.component';

describe('ImageFilePreviewComponent', () => {
  let component: ImageFilePreviewComponent;
  let fixture: ComponentFixture<ImageFilePreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageFilePreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageFilePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
