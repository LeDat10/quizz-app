import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import {
  ADMIN_LAYOUT_STATE,
  CATEGORY_STATE,
  COURSE_STATE,
  ROUTER_STATE,
} from '../constants/Constants';
import { categoryReducer } from '../features/categories/states/category.reducer';
import { CategoryState } from '../features/categories/states/category.state';
import { courseReducer } from '../features/courses/states/course.reducer';
import { CourseState } from '../features/courses/states/course.state';
import { adminLayoutReducer } from '../layouts/admin-layout/states/admin-layout.reducer';
import { AdminLayoutState } from '../layouts/admin-layout/states/admin-layout.state';

export interface AppState {
  [ADMIN_LAYOUT_STATE]: AdminLayoutState;
  [CATEGORY_STATE]: CategoryState;
  [COURSE_STATE]: CourseState;
  [ROUTER_STATE]: RouterReducerState;
}

export const appReducer = {
  [ADMIN_LAYOUT_STATE]: adminLayoutReducer,
  [CATEGORY_STATE]: categoryReducer,
  [COURSE_STATE]: courseReducer,
  [ROUTER_STATE]: routerReducer,
};
