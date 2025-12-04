import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { AppState } from '../../../../store/app.state';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { getRouterParams } from '../../../../store/router/router.selector';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { selectedCourseSelector } from '../../states/course.selector';
import { Course } from '../../../../Models/course.model';
import { loadCourseForEdit } from '../../states/course.actions';
import { StatusTextMap, statusTypeMapFull } from '../../../../constants/status';
import { NzTagModule } from 'ng-zorro-antd/tag';
@Component({
  selector: 'app-course-management',
  imports: [
    RouterOutlet,
    CommonModule,
    NzTabsModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
  ],
  templateUrl: './course-management.component.html',
  styleUrl: './course-management.component.scss',
})
export class CourseManagementComponent implements OnInit, OnDestroy {
  router: Router = inject(Router);
  store: Store<AppState> = inject(Store<AppState>);
  routerParamsSubscription: Subscription | null = null;
  courseId: string | number = '';
  selectedCourse: Course | null = null;
  selectedCourseSubscription: Subscription | null = null;
  statusTypeMap = statusTypeMapFull;
  statusTextMap = StatusTextMap;
  tabs = [
    { label: 'Information', route: 'update', icon: 'info-circle' },
    { label: 'Content', route: 'content', icon: 'book' },
    // { label: 'Giảng viên & Học viên', route: 'instructors', icon: 'team' },
    // { label: 'Cấu hình', route: 'settings', icon: 'setting' },
    // { label: 'Tài chính', route: 'finance', icon: 'dollar' },
    // { label: 'Báo cáo', route: 'reports', icon: 'bar-chart' },
  ];

  ngOnInit(): void {
    this.routerParamsSubscription = this.store
      .select(getRouterParams)
      .subscribe({
        next: (routerParams) => {
          if (routerParams['courseId']) {
            this.courseId = JSON.parse(routerParams['courseId']);
            this.store.dispatch(loadCourseForEdit({ courseId: this.courseId }));
          }
        },
      });
    this.selectedCourseSubscription = this.store
      .select(selectedCourseSelector)
      .subscribe({
        next: (course) => {
          this.selectedCourse = course;
        },
      });
  }

  ngOnDestroy(): void {
    this.selectedCourseSubscription?.unsubscribe();
    this.routerParamsSubscription?.unsubscribe();
  }

  onTabChange(index: number) {
    const route = this.tabs[index].route;
    this.router.navigateByUrl(`/admin/courses/${this.courseId}/${route}`);
  }
}
