import { createReducer, on } from '@ngrx/store';
import { initialState } from './shared.state';
import { getCloudinarySignatureSuccess } from './shared.action';

export const sharedReducer = createReducer(
  initialState,
  on(getCloudinarySignatureSuccess, (state, action) => {
    return {
      ...state,
      cloudinarySignature: action.cloudinaryResponse,
    };
  })
);
