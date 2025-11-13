import { Component, EventEmitter, inject, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { showSidebar } from '../states/admin-layout.actions';

@Component({
  selector: 'app-header',
  imports: [NgIcon, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  store: Store<AppState> = inject(Store);
  onMenuClicked() {
    this.store.dispatch(showSidebar({ value: true }));
  }
}
