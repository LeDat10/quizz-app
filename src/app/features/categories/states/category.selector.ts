import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './category.state';
import { CATEGORY_STATE } from '../../../constants/Constants';

const getCategoryState = createFeatureSelector<CategoryState>(CATEGORY_STATE);

export const getValueShowFormOfCategory = createSelector(
  getCategoryState,
  (state) => state.showForm
);
