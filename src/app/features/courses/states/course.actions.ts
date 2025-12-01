import { createAction, props } from '@ngrx/store';
import {
  AddCourseRequest,
  CoursesPaginationResponse,
} from '../interfaces/course.interface';
import { Course } from '../../../Models/course.model';
import { HttpErrorResponse } from '@angular/common/http';

export const showForm = createAction(
  '[course] show form',
  props<{ value: boolean }>()
);

// set loading
export const setListLoading = createAction(
  '[course] set list loading',
  props<{ value: boolean }>()
);

export const setActionLoading = createAction(
  '[course] set action loading',
  props<{ value: boolean }>()
);

export const setDetailLoading = createAction(
  '[course] set detail loading',
  props<{ value: boolean }>()
);

// add course action
export const addCourse = createAction(
  '[course] add course',
  props<{
    addCourse: AddCourseRequest;
  }>()
);

export const addCourseSuccess = createAction(
  '[course] add course success',
  props<{
    course: Course;
  }>()
);

export const addCourseFailure = createAction(
  '[course] add course failure',
  props<{
    error: HttpErrorResponse;
  }>()
);

// get courses
export const getCourses = createAction('[course] get courses');

export const getCoursesSucccess = createAction(
  '[course] get courses success',
  props<{ coursesResponse: CoursesPaginationResponse }>()
);

export const getCoursesFailure = createAction(
  '[course] get courses failure',
  props<{ error: HttpErrorResponse }>()
);
