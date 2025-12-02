import { createReducer, on } from '@ngrx/store';
import { initialState } from './shared.state';
import {
  getAllCategoriesForDropDownFailure,
  getAllCategoriesForDropDownSuccess,
  getCloudinarySignatureSuccess,
  setDropdownLoaded,
} from './shared.action';

export const sharedReducer = createReducer(
  initialState,
  on(getCloudinarySignatureSuccess, (state, action) => {
    return {
      ...state,
      cloudinarySignature: action.cloudinaryResponse,
    };
  }),

  // get all categories for dropdown
  on(getAllCategoriesForDropDownSuccess, (state, action) => {
    return {
      ...state,
      isDropdownLoaded: true,
      allCategoriesForDropdown: action.categoriesDropdown,
    };
  }),
  on(getAllCategoriesForDropDownFailure, (state, action) => {
    return {
      ...state,
      isDropdownLoaded: false,
      error: action.error,
    };
  }),
  on(setDropdownLoaded, (state, action) => ({
    ...state,
    isDropdownLoaded: action.value,
  }))
);
