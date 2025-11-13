import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDeleteButtonComponent } from './custom-delete-button.component';

describe('CustomDeleteButtonComponent', () => {
  let component: CustomDeleteButtonComponent;
  let fixture: ComponentFixture<CustomDeleteButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomDeleteButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
