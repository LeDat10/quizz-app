import { HttpErrorResponse } from '@angular/common/http';
import { CategoryForDropDown } from '../interfaces/category.interface';
import { CloudinarySignature } from '../interfaces/cloudinary.interface';

export interface SharedState {
  cloudinarySignature: CloudinarySignature | null;
  allCategoriesForDropdown: CategoryForDropDown[] | null;
  isDropdownLoaded: boolean;
  error: HttpErrorResponse | null;
}

export const initialState: SharedState = {
  cloudinarySignature: null,
  allCategoriesForDropdown: null,
  isDropdownLoaded: false,
  error: null,
};
