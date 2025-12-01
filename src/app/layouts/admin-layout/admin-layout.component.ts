import { Component } from '@angular/core';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
@Component({
  selector: 'app-admin-layout',
  imports: [
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzButtonModule,
    NzBreadCrumbModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
})
export class AdminLayoutComponent {
  isCollapsed: boolean = false;
  navItems = [
    {
      iconName: 'dashboard',
      title: 'Dashboard',
      link: '#',
    },
    {
      iconName: 'tags',
      title: 'Category',
      children: [
        {
          title: 'Category',
          link: '/admin/category',
        },
      ],
    },
    {
      iconName: 'read',
      title: 'Course',
      children: [
        {
          title: 'Course',
          link: '/admin/courses',
        },
      ],
    },
  ];
}
