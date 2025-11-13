import { Routes } from '@angular/router';
import { UpdateCourseComponent } from './pages/update-course/update-course.component';

export const COURSES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/course-list/course-list.component').then(
        (m) => m.CourseListComponent
      ),
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
