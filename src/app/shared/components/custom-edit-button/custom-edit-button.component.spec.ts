import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEditButtonComponent } from './custom-edit-button.component';

describe('CustomEditButtonComponent', () => {
  let component: CustomEditButtonComponent;
  let fixture: ComponentFixture<CustomEditButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomEditButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
