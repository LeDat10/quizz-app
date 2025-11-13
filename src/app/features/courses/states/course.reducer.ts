import { createReducer, on } from '@ngrx/store';
import { initialState } from './course.state';
import { showForm } from './course.actions';

export const courseReducer = createReducer(
  initialState,
  on(showForm, (state, action) => {
    return {
      ...state,
      showForm: action.value,
    };
  })
);
