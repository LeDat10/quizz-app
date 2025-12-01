import { createReducer, on } from '@ngrx/store';
import { courseAdapter, initialState } from './course.state';
import { getCoursesSucccess, showForm } from './course.actions';

export const courseReducer = createReducer(
  initialState,
  on(showForm, (state, action) => {
    return {
      ...state,
      showForm: action.value,
    };
  }),
  on(getCoursesSucccess, (state, action) => {
    return courseAdapter.setAll(action.coursesResponse.data, {
      ...state,
      links: action.coursesResponse.links,
      meta: action.coursesResponse.meta,
      listLoading: false,
      loaded: true,
    });
  })
);
