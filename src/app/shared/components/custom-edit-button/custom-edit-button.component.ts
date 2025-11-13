import { NgIf, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-custom-edit-button',
  imports: [NgIconComponent, NgIf, NgClass],
  templateUrl: './custom-edit-button.component.html',
  styleUrl: './custom-edit-button.component.scss',
})
export class CustomEditButtonComponent {
  @Input() content: string = '';
  @Input() customClass: string = '';

  @Output() clicked = new EventEmitter<boolean>();
  OnClicked() {
    this.clicked.emit();
  }
}
