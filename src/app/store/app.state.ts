import { routerReducer, RouterReducerState } from '@ngrx/router-store';
import {
  ADMIN_LAYOUT_STATE,
  CATEGORY_STATE,
  COURSE_STATE,
  ROUTER_STATE,
  SHARED_STATE,
} from '../constants/Constants';
import { CategoryState } from '../features/categories/states/categories.state';
import { CourseState } from '../features/courses/states/course.state';
import { adminLayoutReducer } from '../layouts/admin-layout/states/admin-layout.reducer';
import { AdminLayoutState } from '../layouts/admin-layout/states/admin-layout.state';
import { SharedState } from '../shared/states/shared.state';
import { sharedReducer } from '../shared/states/shared.reducer';

export interface AppState {
  [ADMIN_LAYOUT_STATE]: AdminLayoutState;
  [CATEGORY_STATE]: CategoryState;
  [COURSE_STATE]: CourseState;
  [ROUTER_STATE]: RouterReducerState;
  [SHARED_STATE]: SharedState;
}

export const appReducer = {
  [ADMIN_LAYOUT_STATE]: adminLayoutReducer,
  [ROUTER_STATE]: routerReducer,
  [SHARED_STATE]: sharedReducer,
};
