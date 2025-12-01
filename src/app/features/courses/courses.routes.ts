import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { COURSE_STATE } from '../../constants/Constants';
import { courseReducer } from './states/course.reducer';
import { provideEffects } from '@ngrx/effects';
import { CourseEffect } from './states/course.effect';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/course-list/course-list.component').then(
        (m) => m.CourseListComponent
      ),
    providers: [
      provideState({ name: COURSE_STATE, reducer: courseReducer }),
      provideEffects([CourseEffect]),
    ],
  },
  {
    path: 'update/:courseId',
    loadComponent: () =>
      import('./pages/update-course/update-course.component').then(
        (m) => m.UpdateCourseComponent
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './components/update-course-form/update-course-form.component'
          ).then((m) => m.UpdateCourseFormComponent),
      },
      {
        path: 'content',
        loadComponent: () =>
          import('./pages/content/content.component').then(
            (m) => m.ContentComponent
          ),
      },
    ],
  },
];
