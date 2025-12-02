import { createFeatureSelector, createSelector } from '@ngrx/store';
import { courseAdapter, CourseState } from './course.state';
import { COURSE_STATE } from '../../../constants/Constants';

const getCourseState = createFeatureSelector<CourseState>(COURSE_STATE);
const { selectAll } = courseAdapter.getSelectors();
export const getValueShowFormOfCourse = createSelector(
  getCourseState,
  (state) => state.showForm
);

export const selectCourseLoaded = createSelector(
  getCourseState,
  (state) => state.loaded
);

export const getCoursesSelector = createSelector(getCourseState, (state) =>
  selectAll(state)
);

// get loading
export const getListLoadingSelector = createSelector(
  getCourseState,
  (state) => state.listLoading
);

export const getActionLoadingSelector = createSelector(
  getCourseState,
  (state) => state.actionLoading
);

// get meta
export const getCourseMetaSelector = createSelector(
  getCourseState,
  (state) => state.meta
);
