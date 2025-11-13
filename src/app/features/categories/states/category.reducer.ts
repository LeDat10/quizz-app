import { createReducer, on } from '@ngrx/store';
import { initialState } from './category.state';
import { showForm } from './category.actions';

export const categoryReducer = createReducer(
  initialState,
  on(showForm, (state, action) => {
    return {
      ...state,
      showForm: action.value,
    };
  })
);
