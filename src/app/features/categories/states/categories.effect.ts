import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '../services/category.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/app.state';
import {
  addCategory,
  addCategoryFailure,
  addCategorySuccess,
  changeCategoryPage,
  changeCategoryPageFailure,
  changeCategoryPageSuccess,
  changeCategoryStatus,
  changeCategoryStatusFailure,
  changeCategoryStatusSuccess,
  getCategories,
  getCategoriesFailure,
  getCategoriesSuccess,
  getCategoryDetail,
  getCategoryDetailFailure,
  getCategoryDetailSuccess,
  loadCategoryForEdit,
  loadCategoryForEditFailure,
  loadCategoryForEditSuccess,
  setActionLoading,
  setDetailLoading,
  setIsLoading,
  setListLoading,
  showForm,
  updateCategory,
  updateCategoryFailure,
  updateCategoryPositionMultiple,
  updateCategoryPositionMultipleSuccess,
  updateCategoryPositionMutipleFailure,
  updateCategoryStatusMutipleFailure,
  updateCategoryStatusMutipleSuccess,
  updateCategoryStatusnMultiple,
  updateCategorySuccess,
} from './categories.actions';
import {
  catchError,
  exhaustMap,
  filter,
  map,
  of,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import {
  getCategoriesSelector,
  getMetaSelector,
  selectCategoryLoaded,
} from './categories.selector';
import {
  CategoryPaginationResponse,
  CategoryResponse,
} from '../interfaces/category.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { DEFAULT_LIMIT } from '../../../constants/Constants';
import { HttpErrorResponse } from '@angular/common/http';
import {
  SUCCESS_MESSAGES,
  SUCCESS_TITLES,
} from '../../../constants/success-message';
@Injectable()
export class categoriesEffect {
  action$: Actions = inject(Actions);
  categoryService: CategoryService = inject(CategoryService);
  store: Store<AppState> = inject(Store);
  notification: NzNotificationService = inject(NzNotificationService);

  getCategories$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategories),
      withLatestFrom(this.store.select(selectCategoryLoaded)),
      filter(([_, loaded]) => !loaded),
      exhaustMap(() => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.categoryService.getCategories().pipe(
          map((response: CategoryPaginationResponse) => {
            return getCategoriesSuccess({ response });
          }),
          catchError((error) => {
            return of(getCategoriesFailure({ error: error }));
          })
        );
      })
    );
  });

  changeCategoryStatus$ = createEffect(() => {
    return this.action$.pipe(
      ofType(changeCategoryStatus),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.categoryService.changeCategoryStatus(action).pipe(
          map((response) => {
            this.notification.success(
              SUCCESS_TITLES.CHANGED_STATUS,
              SUCCESS_MESSAGES.CATEGORY_STATUS_UPDATED
            );
            return changeCategoryStatusSuccess({ categoryRespone: response });
          }),
          catchError((error: HttpErrorResponse) =>
            of(changeCategoryStatusFailure({ error }))
          )
        );
      })
    );
  });

  // get category detail
  getCategoryDetail$ = createEffect(() => {
    return this.action$.pipe(
      ofType(getCategoryDetail),
      withLatestFrom(this.store.select(getCategoriesSelector)),
      switchMap(([action, categories]) => {
        this.store.dispatch(setDetailLoading({ value: true }));
        const categoryStore = categories.find(
          (category) => category.id === action.categoryId
        );
        if (categoryStore) {
          this.notification.success(
            SUCCESS_TITLES.FETCHED,
            SUCCESS_MESSAGES.CATEGORY_FETCHED
          );
          return of(getCategoryDetailSuccess({ category: categoryStore }));
        }

        return this.categoryService.getCategoryDetail(action.categoryId).pipe(
          map((category) => {
            this.notification.success(
              SUCCESS_TITLES.FETCHED,
              SUCCESS_MESSAGES.CATEGORY_FETCHED
            );
            return getCategoryDetailSuccess({ category });
          }),
          catchError((error: HttpErrorResponse) =>
            of(getCategoryDetailFailure({ error }))
          )
        );
      })
    );
  });

  // update category
  updateCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategory),
      exhaustMap((action) => {
        this.store.dispatch(setActionLoading({ value: true }));
        return this.categoryService
          .updateCategory(action.id, action.updateCategoryRequest)
          .pipe(
            map((response) => {
              return updateCategorySuccess({ category: response.data });
            }),
            catchError((error) => {
              // let errorMessage = generateErrorMessage(error);
              // this.notification.error(
              //   error.error || 'Update Category Fail',
              //   errorMessage
              // );
              return of(updateCategoryFailure({ error }));
            })
          );
      })
    );
  });

  updateCategorySuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategorySuccess),
      tap(() => {
        this.store.dispatch(showForm({ value: false }));
        this.notification.success(
          SUCCESS_TITLES.UPDATED,
          SUCCESS_MESSAGES.CATEGORY_UPDATED
        );
      }),
      withLatestFrom(this.store.select(getMetaSelector)),
      map(([_, meta]) =>
        changeCategoryPage({
          queryParams: {
            limit: meta?.itemsPerPage || DEFAULT_LIMIT,
            page: meta?.currentPage || 1,
          },
        })
      )
    );
  });

  // add category
  addCategory$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addCategory),
      exhaustMap((action) => {
        this.store.dispatch(setActionLoading({ value: true }));
        return this.categoryService.addCategory(action.addCategoryRequest).pipe(
          map((response: CategoryResponse) => {
            return addCategorySuccess({ category: response.data });
          }),
          catchError((error) => {
            // let errorMessage = '';
            // errorMessage = generateErrorMessage(error);
            // this.notification.error('Add Category Error', errorMessage);
            return of(addCategoryFailure({ error }));
          })
        );
      })
    );
  });

  addCategorySuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(addCategorySuccess),
      tap(() => {
        this.store.dispatch(showForm({ value: false }));
        this.notification.success(
          SUCCESS_TITLES.CREATED,
          SUCCESS_MESSAGES.CATEGORY_CREATED
        );
      }),
      withLatestFrom(this.store.select(getMetaSelector)),
      map(([_, meta]) =>
        changeCategoryPage({
          queryParams: {
            limit: meta?.itemsPerPage || DEFAULT_LIMIT,
            page: 1,
          },
        })
      )
    );
  });

  changeCategoryPage$ = createEffect(() => {
    return this.action$.pipe(
      ofType(changeCategoryPage),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.categoryService.getCategories(action.queryParams).pipe(
          map((response) => {
            return changeCategoryPageSuccess({ categoryResponse: response });
          }),
          catchError((error: HttpErrorResponse) => {
            return of(changeCategoryPageFailure({ error }));
          })
        );
      })
    );
  });

  // update category position multiple
  updateCategoryPositionMultiple$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategoryPositionMultiple),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.categoryService
          .updateCategoryPositionMultiple(action.dataRequests)
          .pipe(
            map((response) => {
              return updateCategoryPositionMultipleSuccess();
            }),
            catchError((error: HttpErrorResponse) =>
              of(updateCategoryPositionMutipleFailure({ error }))
            )
          );
      })
    );
  });

  updateCategoryPositionMultipleSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategoryPositionMultipleSuccess),
      tap(() => {
        this.notification.success(
          SUCCESS_TITLES.CHANGED_POSITION,
          SUCCESS_MESSAGES.CATEGORIES_POSITION_UPDATED
        );
      }),
      withLatestFrom(this.store.select(getMetaSelector)),
      map(([_, meta]) =>
        changeCategoryPage({
          queryParams: {
            limit: meta?.itemsPerPage || DEFAULT_LIMIT,
            page: meta?.currentPage || 1,
          },
        })
      )
    );
  });

  // update category status multiple
  updateCategoryStatusMultiple$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategoryStatusnMultiple),
      exhaustMap((action) => {
        this.store.dispatch(setListLoading({ value: true }));
        return this.categoryService
          .updateCategoryStatusMultiple(action.request)
          .pipe(
            map(() => {
              return updateCategoryStatusMutipleSuccess();
            }),
            catchError((error: HttpErrorResponse) =>
              of(updateCategoryStatusMutipleFailure({ error }))
            )
          );
      })
    );
  });

  updateCategoryStatusMutipleSuccess$ = createEffect(() => {
    return this.action$.pipe(
      ofType(updateCategoryStatusMutipleSuccess),
      tap(() => {
        this.notification.success(
          SUCCESS_TITLES.UPDATED,
          SUCCESS_MESSAGES.CATEGORIES_STATUS_UPDATED
        );
      }),
      withLatestFrom(this.store.select(getMetaSelector)),
      map(([_, meta]) =>
        changeCategoryPage({
          queryParams: {
            limit: meta?.itemsPerPage || DEFAULT_LIMIT,
            page: meta?.currentPage || 1,
          },
        })
      )
    );
  });

  // load category for edit
  loadCategoryForEdit$ = createEffect(() => {
    return this.action$.pipe(
      ofType(loadCategoryForEdit),
      withLatestFrom(this.store.select(getCategoriesSelector)),
      switchMap(([action, categories]) => {
        this.store.dispatch(setDetailLoading({ value: true }));
        const categoryStore = categories.find(
          (category) => category.id === action.categoryId
        );
        if (categoryStore) {
          return of(loadCategoryForEditSuccess({ category: categoryStore }));
        }
        return this.categoryService.getCategoryDetail(action.categoryId).pipe(
          map((reponse) => loadCategoryForEditSuccess({ category: reponse })),
          catchError((error: HttpErrorResponse) =>
            of(loadCategoryForEditFailure({ error }))
          )
        );
      })
    );
  });
}
