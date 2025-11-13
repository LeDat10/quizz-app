import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RouterStateUrl } from './custom-serializer';
import { ROUTER_STATE } from '../../constants/Constants';

const getRouterState =
  createFeatureSelector<RouterReducerState<RouterStateUrl>>(ROUTER_STATE);

export const getRouterParams = createSelector(getRouterState, (state) => {
  return state.state.params;
});

export const getQueryParams = createSelector(getRouterState, (state) => {
  return state.state.queryParams;
});

export const getRouterUrl = createSelector(getRouterState, (state) => {
  return state.state.url;
});
