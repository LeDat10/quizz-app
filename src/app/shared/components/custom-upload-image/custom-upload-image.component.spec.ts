import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomUploadImageComponent } from './custom-upload-image.component';

describe('CustomUploadImageComponent', () => {
  let component: CustomUploadImageComponent;
  let fixture: ComponentFixture<CustomUploadImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomUploadImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomUploadImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
