import { createAction, props } from '@ngrx/store';
import {
  CloudinarySignature,
  CloudinaryRequest,
  DeleteCloudinaryRequest,
} from '../interfaces/cloudinary.interface';
import { CategoryForDropDown } from '../interfaces/category.interface';
import { HttpErrorResponse } from '@angular/common/http';

export const getCloudinarySignature = createAction(
  '[shared] get cloudinary signature',
  props<{
    cloudinary: CloudinaryRequest;
  }>()
);

export const getCloudinarySignatureSuccess = createAction(
  '[shared] get cloudinary signature success',
  props<{ cloudinaryResponse: CloudinarySignature }>()
);

export const deleteCloudinaryFile = createAction(
  '[shared] delete cloudinary file',
  props<{ deleteCloudinaryRequest: DeleteCloudinaryRequest }>()
);

// get all categories for dropdown
export const getAllCategoriesForDropDown = createAction(
  '[shared] get all categories for dropdown'
);

export const getAllCategoriesForDropDownSuccess = createAction(
  '[shared] get all categories for dropdown success',
  props<{ categoriesDropdown: CategoryForDropDown[] }>()
);

export const getAllCategoriesForDropDownFailure = createAction(
  '[shared] get all categories for dropdown failure',
  props<{ error: HttpErrorResponse }>()
);

export const setDropdownLoaded = createAction(
  '[shared] set dropdown loaded',
  props<{ value: boolean }>()
);
