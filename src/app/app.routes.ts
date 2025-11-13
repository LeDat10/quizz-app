import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'category',
        loadChildren: () =>
          import('./features/categories/category.routes').then(
            (m) => m.CATEGORY_ROUTES
          ),
      },
      {
        path: 'courses',
        loadChildren: () =>
          import('./features/courses/courses.routes').then(
            (m) => m.COURSES_ROUTES
          ),
      },
    ],
  },
];
