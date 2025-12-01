import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SharedState } from './shared.state';
import { SHARED_STATE } from '../../constants/Constants';

const getSharedState = createFeatureSelector<SharedState>(SHARED_STATE);

export const getCloudinarySignatureSelector = createSelector(
  getSharedState,
  (state) => state.cloudinarySignature
);
