import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AdminLayoutState } from './admin-layout.state';
import { ADMIN_LAYOUT_STATE } from '../../../constants/Constants';

const getAdminLayoutState =
  createFeatureSelector<AdminLayoutState>(ADMIN_LAYOUT_STATE);

export const getShowSidebar = createSelector(
  getAdminLayoutState,
  (state) => state.showSidebar
);
