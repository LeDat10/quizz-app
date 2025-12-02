import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AppState } from '../../../../store/app.state';
import {
  getCoursesSelector,
  getListLoadingSelector,
} from '../../states/course.selector';
import { Course } from '../../../../Models/course.model';
import { Observable, Subscription } from 'rxjs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { statusTypeMapFull } from '../../../../constants/status';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import { CourseTypeColor } from '../../../../constants/Constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { StatusType } from '../../../../shared/enums/status.enum';
import { changeCourseStatus } from '../../states/course.actions';
@Component({
  selector: 'app-course-table',
  imports: [
    NzTableModule,
    NzTagModule,
    NzIconModule,
    NzGridModule,
    NzButtonModule,
    NzInputNumberModule,
    FormsModule,
    NzSpinModule,
    CommonModule,
  ],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss',
})
export class CourseTableComponent implements OnInit, OnDestroy {
  store: Store<AppState> = inject(Store<AppState>);
  courses: Course[] = [];
  statusTypeMap = statusTypeMapFull;
  courseTypeColor = CourseTypeColor;
  getCoursesSubscription: Subscription | null = null;
  checked: boolean = false;
  listLoading$: Observable<boolean> | null = null;

  ngOnInit(): void {
    this.getCoursesSubscription = this.store
      .select(getCoursesSelector)
      .subscribe({
        next: (courses: Course[]) => {
          this.courses = courses.map((item) => ({ ...item }));
        },
      });
    this.listLoading$ = this.store.select(getListLoadingSelector);
  }

  ngOnDestroy(): void {
    this.getCoursesSubscription?.unsubscribe();
  }

  OnChangeStatus(params: { id: string | number; status: StatusType }) {
    let statusRequest: StatusType = StatusType.DRAFT;
    switch (params.status) {
      case StatusType.DRAFT:
        statusRequest = StatusType.PUBLISHED;
        break;
      case StatusType.PUBLISHED:
        statusRequest = StatusType.INACTIVE;
        break;
      case StatusType.INACTIVE:
        statusRequest = StatusType.ARCHIVED;
        break;
      case StatusType.ARCHIVED:
        statusRequest = StatusType.DRAFT;
        break;
      default:
        statusRequest = StatusType.DRAFT;
        break;
    }

    params.status = statusRequest;
    this.store.dispatch(changeCourseStatus({ params }));
  }
}
