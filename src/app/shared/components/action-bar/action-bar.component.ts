import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { NzButtonComponent, NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { StatusType } from '../../enums/cloudinary.enum';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { statusTypeMapFull } from '../../../constants/status';
import { ActionBarConfig } from '../../interfaces/action-bar.interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-action-bar',
  imports: [
    NzCardModule,
    NzSpaceModule,
    NzButtonComponent,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
    NzBadgeModule,
    CommonModule,
  ],
  templateUrl: './action-bar.component.html',
  styleUrl: './action-bar.component.scss',
})
export class ActionBarComponent {
  statusTypeMap = statusTypeMapFull;

  @Input() statusList: { value: StatusType; label: string }[] = [
    { value: StatusType.DRAFT, label: 'Draft' },
    { value: StatusType.PUBLISHED, label: 'Pubilished' },
    { value: StatusType.INACTIVE, label: 'Inactive' },
    { value: StatusType.ARCHIVED, label: 'Archived' },
  ];
  @Input() selectedQuantity = 0;
  @Input() actionBarConfig: ActionBarConfig = {
    status: true,
    position: true,
    delete: true,
  };
  @Output() positionClicked: EventEmitter<void> = new EventEmitter<void>();
  @Output() statusClicked: EventEmitter<StatusType> =
    new EventEmitter<StatusType>();
  @Output() closeActionBarClicked: EventEmitter<void> =
    new EventEmitter<void>();
  OnClickedPosition() {
    this.positionClicked.emit();
  }

  OnStatusChange(value: StatusType) {
    this.statusClicked.emit(value);
  }

  OnCloseActionBar() {
    this.closeActionBarClicked.emit();
  }
}
