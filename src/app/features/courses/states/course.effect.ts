import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CourseService } from '../services/course.service';
import {
  addCourse,
  addCourseSuccess,
  getCourses,
  getCoursesSucccess,
} from './course.actions';
import { exhaustMap, filter, map, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import { selectCourseLoaded } from './course.selector';

@Injectable()
export class CourseEffect {
  actions$: Actions = inject(Actions);
  courseService: CourseService = inject(CourseService);
  store: Store = inject(Store<AppState>);

  // add course
  addCourse$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(addCourse),
      exhaustMap((action) => {
        return this.courseService.addCourse(action.addCourse).pipe(
          map((addCourseResponse) => {
            return addCourseSuccess({ course: addCourseResponse.data });
          })
        );
      })
    );
  });

  // get all course
  getCourses$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(getCourses),
      withLatestFrom(this.store.select(selectCourseLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() => {
        return this.courseService.getCourses().pipe(
          map((response) => {
            return getCoursesSucccess({ coursesResponse: response });
          })
        );
      })
    );
  });
}
