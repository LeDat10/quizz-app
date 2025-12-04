import { createAction, props } from '@ngrx/store';
import {
  AddCategoryRequest,
  CategoryPaginationResponse,
  CategoryResponse,
  UpdateCategoryRequest,
} from '../interfaces/category.interface';
import { Category } from '../../../Models/category.model';
import { HttpErrorResponse } from '@angular/common/http';

export const showForm = createAction(
  '[category] show form',
  props<{ value: boolean }>()
);

export const getCategories = createAction('[category] get category');

export const getCategoriesSuccess = createAction(
  '[category] get categories success',
  props<{ response: CategoryPaginationResponse }>()
);

export const getCategoriesFailure = createAction(
  '[category] get categories failure',
  props<{ error: HttpErrorResponse }>()
);

export const setIsLoading = createAction(
  '[category] set loading',
  props<{ loading: boolean }>()
);

// add category
export const addCategory = createAction(
  '[category] add category',
  props<{ addCategoryRequest: AddCategoryRequest }>()
);

export const addCategorySuccess = createAction(
  '[category] add category success',
  props<{ category: Category }>()
);

export const addCategoryFailure = createAction(
  '[category] add category failure',
  props<{ error: HttpErrorResponse }>()
);

// change category status
export const changeCategoryStatus = createAction(
  '[category] change category status',
  props<{ id: number | string; status: string }>()
);

export const changeCategoryStatusSuccess = createAction(
  '[category] change category status success',
  props<{ categoryRespone: CategoryResponse }>()
);

export const changeCategoryStatusFailure = createAction(
  '[category] change category status failure',
  props<{ error: HttpErrorResponse }>()
);

// get category detail
export const getCategoryDetail = createAction(
  '[category] get category detail',
  props<{ categoryId: string | number }>()
);

export const getCategoryDetailSuccess = createAction(
  '[category] get category detail success',
  props<{ category: Category }>()
);

export const getCategoryDetailFailure = createAction(
  '[category] get category detail failure',
  props<{ error: HttpErrorResponse }>()
);

// update category action
export const updateCategory = createAction(
  '[category] update category',
  props<{ id: string | number; updateCategoryRequest: UpdateCategoryRequest }>()
);

export const updateCategorySuccess = createAction(
  '[category] update category success',
  props<{ category: Category }>()
);

export const updateCategoryFailure = createAction(
  '[category] update category failure',
  props<{ error: HttpErrorResponse }>()
);

// change category page action
export const changeCategoryPage = createAction(
  '[category] change category page',
  props<{ queryParams: { limit?: number; page?: number } }>()
);

export const changeCategoryPageSuccess = createAction(
  '[category] change category page success',
  props<{ categoryResponse: CategoryPaginationResponse }>()
);

export const changeCategoryPageFailure = createAction(
  '[category] change category page failure',
  props<{ error: HttpErrorResponse }>()
);

// update category position mutilple
export const updateCategoryPositionMultiple = createAction(
  '[category] update category position multiple',
  props<{ dataRequests: { id: number | string; position: number }[] }>()
);

export const updateCategoryPositionMultipleSuccess = createAction(
  '[category] update category position multiple success'
);

export const updateCategoryPositionMutipleFailure = createAction(
  '[category] update category postion multiple failure',
  props<{ error: HttpErrorResponse }>()
);

// set loading
export const setListLoading = createAction(
  '[category] set list loading',
  props<{ value: boolean }>()
);

export const setActionLoading = createAction(
  '[category] set action loading',
  props<{ value: boolean }>()
);

export const setDetailLoading = createAction(
  '[category] set detail loading',
  props<{ value: boolean }>()
);

// update category status multiple
export const updateCategoryStatusnMultiple = createAction(
  '[category] update category status multiple',
  props<{
    request: {
      ids: number[] | string[];
      status: string;
    };
  }>()
);

export const updateCategoryStatusMutipleSuccess = createAction(
  '[category] update category status multiple success'
);

export const updateCategoryStatusMutipleFailure = createAction(
  '[category] update category status multiple failure',
  props<{ error: HttpErrorResponse }>()
);

// load category for edit
export const loadCategoryForEdit = createAction(
  '[category] load category for edit',
  props<{ categoryId: number | string }>()
);

export const loadCategoryForEditSuccess = createAction(
  '[category] load category for edit success',
  props<{ category: Category }>()
);

export const loadCategoryForEditFailure = createAction(
  '[category] load category for edit failure',
  props<{ error: HttpErrorResponse }>()
);

// set selected category
export const setSelectedCategory = createAction(
  '[category] set selected category',
  props<{ selectedCategory: Category | null }>()
);
