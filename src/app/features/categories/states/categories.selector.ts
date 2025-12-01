import { createFeatureSelector, createSelector } from '@ngrx/store';
import { categoryAdapter, CategoryState } from './categories.state';
import { CATEGORY_STATE } from '../../../constants/Constants';
import { getQueryParams } from '../../../store/router/router.selector';

const getCategoryState = createFeatureSelector<CategoryState>(CATEGORY_STATE);
const { selectAll } = categoryAdapter.getSelectors();
export const getValueShowFormOfCategory = createSelector(
  getCategoryState,
  (state) => state.showForm
);

export const selectCategoryLoaded = createSelector(
  getCategoryState,
  (state) => state.loaded
);

export const getCategoriesSelector = createSelector(getCategoryState, (state) =>
  selectAll(state)
);

export const getSelectedCategorySelector = createSelector(
  getCategoryState,
  (state) => state.selectedCategory
);

export const getMetaSelector = createSelector(
  getCategoryState,
  (state) => state.meta
);

export const getCategoryListLoadingSelector = createSelector(
  getCategoryState,
  (state) => state.listLoading
);

export const getCategoryDetailLoadingSelector = createSelector(
  getCategoryState,
  (state) => state.detailLoading
);

export const getCategoryActionLoadingSelector = createSelector(
  getCategoryState,
  (state) => state.actionLoading
);
