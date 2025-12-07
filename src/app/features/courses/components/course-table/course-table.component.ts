import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AppState } from '../../../../store/app.state';
import {
  getCourseMetaSelector,
  getCoursesSelector,
  getListLoadingSelector,
} from '../../states/course.selector';
import { Course } from '../../../../Models/course.model';
import {
  combineLatest,
  map,
  Observable,
  Subject,
  Subscription,
  takeUntil,
} from 'rxjs';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { statusTypeMapFull } from '../../../../constants/status';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule } from '@angular/forms';
import {
  CourseTypeColor,
  DEFAULT_LIMIT,
} from '../../../../constants/Constants';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { CommonModule } from '@angular/common';
import { StatusType } from '../../../../shared/enums/status.enum';
import {
  changeCoursePositionMultiple,
  changeCoursesPage,
  changeCourseStatus,
  changeCourseStatusMultiple,
} from '../../states/course.actions';
import { Router } from '@angular/router';
import { SelectionState } from '../../interfaces/course.interface';
import { ActionBarComponent } from '../../../../shared/components/action-bar/action-bar.component';

const STATUS_TRANSITIONS: Record<StatusType, StatusType> = {
  [StatusType.DRAFT]: StatusType.PUBLISHED,
  [StatusType.PUBLISHED]: StatusType.INACTIVE,
  [StatusType.INACTIVE]: StatusType.ARCHIVED,
  [StatusType.ARCHIVED]: StatusType.DRAFT,
};

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
    ActionBarComponent,
  ],
  templateUrl: './course-table.component.html',
  styleUrl: './course-table.component.scss',
})
export class CourseTableComponent implements OnInit, OnDestroy {
  private readonly store: Store<AppState> = inject(Store<AppState>);
  private readonly router: Router = inject(Router);

  readonly courses$ = this.store.select(getCoursesSelector);
  readonly loading$ = this.store.select(getListLoadingSelector);
  readonly meta$ = this.store.select(getCourseMetaSelector);
  readonly tableState$ = this.meta$.pipe(
    map((meta) => ({
      total: meta?.totalItems || 0,
      pageIndex: meta?.currentPage || 1,
      pageSize: meta?.itemsPerPage || DEFAULT_LIMIT,
    }))
  );

  readonly destroy$ = new Subject<void>();

  private readonly selectedIds = new Set<number>();
  readonly selections$: Observable<SelectionState> = combineLatest([
    this.courses$,
  ]).pipe(
    map(([courses]) => ({
      selectedIds: this.selectedIds,
      hasSelection: this.selectedIds.size > 0,
      selectionCount: this.selectedIds.size,
      allSelected:
        courses.length > 0 &&
        courses.every((item) => this.selectedIds.has(item.id)),
      indeterminate:
        this.selectedIds.size > 0 &&
        courses.some((item) => !this.selectedIds.has(item.id)),
    }))
  );

  readonly statusTypeMap = statusTypeMapFull;
  courses: Course[] = [];
  courseTypeColor = CourseTypeColor;
  checked: boolean = false;
  indeterminate = false;
  ngOnInit(): void {
    this.subscribeToCourses();
  }

  private subscribeToCourses(): void {
    this.courses$.pipe(takeUntil(this.destroy$)).subscribe((courses) => {
      this.courses = courses.map((item) => ({ ...item }));
      this.updateSelectionState();
    });
  }

  onChangeStatus(params: { id: string | number; status: StatusType }) {
    const currentStatus = params.status as StatusType;
    const nextStatus = STATUS_TRANSITIONS[currentStatus] || StatusType.DRAFT;

    this.store.dispatch(
      changeCourseStatus({ params: { id: params.id, status: nextStatus } })
    );
  }

  private updateSelectionState(): void {
    this.checked =
      this.courses.length > 0 &&
      this.courses.every((item) => this.selectedIds.has(item.id));
    this.indeterminate = this.selectedIds.size > 0 && !this.checked;
  }

  private getSelectedPositions(): Array<{ id: number; position: number }> {
    return this.courses
      .filter((item) => this.selectedIds.has(item.id))
      .map((item) => ({
        id: item.id,
        position: item.position,
      }));
  }

  onPageIndexChange(pageIndex: number): void {
    this.store.dispatch(
      changeCoursesPage({
        queryParams: {
          page: pageIndex,
          limit: DEFAULT_LIMIT,
        },
      })
    );
  }

  onPageSizeChange(pageSize: number): void {
    this.store.dispatch(
      changeCoursesPage({
        queryParams: {
          page: 1,
          limit: pageSize,
        },
      })
    );
  }

  onAllChecked(checked: boolean): void {
    if (checked) {
      this.courses.forEach((item) => this.selectedIds.add(item.id));
    } else {
      this.selectedIds.clear();
    }
    this.updateSelectionState();
  }

  onItemChecked(id: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(id);
    } else {
      this.selectedIds.delete(id);
    }
    this.updateSelectionState();
  }

  onEditCourse(id: string | number) {
    this.router.navigateByUrl(`/admin/courses/${id}/update`);
  }

  onUpdateStatusMultiple(status: StatusType): void {
    const ids = Array.from(this.selectedIds);

    if (ids.length == 0) {
      return;
    }

    this.store.dispatch(
      changeCourseStatusMultiple({ statusMultipleRequest: { ids, status } })
    );
  }

  getSelectionCount(): number {
    return this.selectedIds.size;
  }

  onCloseActionBar(): void {
    this.selectedIds.clear();
    this.updateSelectionState();
  }

  isItemSelected(id: number): boolean {
    return this.selectedIds.has(id);
  }

  onUpdatePositionMultiple(): void {
    const selectedPositions = this.getSelectedPositions();
    if (selectedPositions.length === 0) return;

    this.store.dispatch(
      changeCoursePositionMultiple({
        positionMultipleRequest: selectedPositions,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
