import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { Observable } from 'rxjs';
import { getShowSidebar } from '../states/admin-layout.selector';
import { showSidebar } from '../states/admin-layout.actions';

@Component({
  selector: 'app-sidebar',
  imports: [NgIcon, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  store: Store<AppState> = inject(Store);
  navItems = [
    {
      iconName: 'matDashboard',
      title: 'Dashboard',
      link: '#',
    },
    {
      iconName: 'matCategory',
      title: 'Category',
      link: '/admin/category',
    },
    {
      iconName: 'matMenuBook',
      title: 'Course',
      link: '/admin/courses',
    },
  ];

  showSidebar$: Observable<boolean> | null = null;

  ngOnInit(): void {
    this.showSidebar$ = this.store.select(getShowSidebar);
  }

  onCloseSidebar() {
    this.store.dispatch(showSidebar({ value: false }));
  }
}
