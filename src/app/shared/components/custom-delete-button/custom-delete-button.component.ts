import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIconComponent } from '@ng-icons/core';

@Component({
  selector: 'app-custom-delete-button',
  imports: [NgIconComponent, CommonModule],
  templateUrl: './custom-delete-button.component.html',
  styleUrl: './custom-delete-button.component.scss',
})
export class CustomDeleteButtonComponent {
  @Input() customClass: string = '';
  @Input() titlePopup: string = '';
  @Input() descriptionPopup: string = '';
  @Output() confirm = new EventEmitter<boolean>();
  showPopupDelete: boolean = false;
  OnOpenPopup() {
    this.showPopupDelete = true;
  }

  OnClosePopup() {
    this.showPopupDelete = false;
  }

  OnConfirm() {
    this.confirm.emit(true);
    this.showPopupDelete = false;
  }
}
