import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourseState } from './course.state';
import { COURSE_STATE } from '../../../constants/Constants';

const getCourseState = createFeatureSelector<CourseState>(COURSE_STATE);

export const getValueShowFormOfCourse = createSelector(
  getCourseState,
  (state) => state.showForm
);

export const selectCourseLoaded = createSelector(
  getCourseState,
  (state) => state.loaded
);
