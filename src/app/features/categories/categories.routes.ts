import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { CATEGORY_STATE } from '../../constants/Constants';
import { categoryReducer } from './states/categories.reducer';
import { provideEffects } from '@ngrx/effects';
import { categoriesEffect } from './states/categories.effect';

export const CATEGORY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/category-list/category-list.component').then(
        (m) => m.CategoryListComponent
      ),
    providers: [
      provideState({ name: CATEGORY_STATE, reducer: categoryReducer }),
      provideEffects([categoriesEffect]),
    ],
  },
];
