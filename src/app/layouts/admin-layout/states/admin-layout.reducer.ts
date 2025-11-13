import { createReducer, on } from '@ngrx/store';
import { initialState } from './admin-layout.state';
import { showSidebar } from './admin-layout.actions';

export const adminLayoutReducer = createReducer(
  initialState,
  on(showSidebar, (state, action) => {
    return {
      ...state,
      showSidebar: action.value,
    };
  })
);
