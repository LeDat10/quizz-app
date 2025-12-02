import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CourseService } from '../services/course.service';
import {
  addCourse,
  addCourseFailure,
  addCourseSuccess,
  changeCoursesPage,
  changeCoursesPageFailure,
  changeCoursesPageSuccess,
  changeCourseStatus,
  changeCourseStatusFailure,
  changeCourseStatusSuccess,
  getCourses,
  getCoursesFailure,
  getCoursesSucccess,
  setActionLoading,
  setListLoading,
  showForm,
} from './course.actions';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { getCourseMetaSelector, selectCourseLoaded } from './course.selector';
import { HttpErrorResponse } from '@angular/common/http';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import {
  SUCCESS_MESSAGES,
  SUCCESS_TITLES,
} from '../../../constants/success-message';
import { DEFAULT_LIMIT } from '../../../constants/Constants';

@Injectable()
export class CourseEffect {
  actions$: Actions = inject(Actions);
  courseService: CourseService = inject(CourseService);
  store: Store = inject(Store<AppState>);
  notification: NzNotificationService = inject(NzNotificationService);

  // add course
  addCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addCourse),
      exhaustMap((action) => {
        this.store.dispatch(setActionLoading({ value: true }));
        return this.courseService.addCourse(action.addCourse).pipe(
          map((addCourseResponse) => {
            return addCourseSuccess({ course: addCourseResponse.data });
          }),
          catchError((error: HttpErrorResponse) =>
            of(addCourseFailure({ error }))
          )
        );
      })
    );
  });

  addCourseSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addCourseSuccess),
      tap(() => {
        this.store.dispatch(showForm({ value: false }));
        this.notification.success(
          SUCCESS_TITLES.CREATED,
          SUCCESS_MESSAGES.COURSE_CREATED
        );
      }),
      withLatestFrom(this.store.select(getCourseMetaSelector)),
      map(([_, meta]) =>
        changeCoursesPage({
          queryParams: { limit: meta?.itemsPerPage || DEFAULT_LIMIT, page: 1 },
        })
      )
    );
  });

  // get all course
  getCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCourses),
      withLatestFrom(this.store.select(selectCourseLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.courseService.getCourses().pipe(
          map((response) => {
            return getCoursesSucccess({ coursesResponse: response });
          }),
          catchError((error: HttpErrorResponse) =>
            of(getCoursesFailure({ error }))
          )
        );
      })
    );
  });

  // change courses page
  changeCoursesPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changeCoursesPage),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.courseService.getCourses(action.queryParams).pipe(
          map((response) =>
            changeCoursesPageSuccess({ coursesResponse: response })
          ),
          catchError((error) => of(changeCoursesPageFailure(error)))
        );
      })
    );
  });

  // change course status
  changeCourseStatus$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(changeCourseStatus),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.courseService.changeCourseStatus(action.params).pipe(
          map((response) => {
            this.notification.success(
              SUCCESS_TITLES.CHANGED_STATUS,
              SUCCESS_MESSAGES.COURSE_STATUS_UPDATED
            );
            return changeCourseStatusSuccess({ courseResponse: response.data });
          }),
          catchError((error) => of(changeCourseStatusFailure(error)))
        );
      })
    );
  });
}
