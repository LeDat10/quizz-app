import { createReducer, on } from '@ngrx/store';
import { courseAdapter, initialState } from './course.state';
import {
  addCourseFailure,
  addCourseSuccess,
  changeCoursePositionMultipleFailure,
  changeCoursePositionMultipleSuccess,
  changeCoursesPageFailure,
  changeCoursesPageSuccess,
  changeCourseStatusFailure,
  changeCourseStatusMultipleFailure,
  changeCourseStatusMultipleSuccess,
  changeCourseStatusSuccess,
  getCoursesFailure,
  getCoursesSucccess,
  loadCourseForEditFailure,
  loadCourseForEditSuccess,
  setActionLoading,
  setDetailLoading,
  setListLoading,
  setSelectedCourse,
  showForm,
  updateCourseFailure,
  updateCourseSuccess,
} from './course.actions';

export const courseReducer = createReducer(
  initialState,
  on(showForm, (state, action) => {
    return {
      ...state,
      showForm: action.value,
    };
  }),

  // loading
  on(setListLoading, (state, action) => {
    return {
      ...state,
      listLoading: action.value,
    };
  }),
  on(setActionLoading, (state, action) => {
    return {
      ...state,
      actionLoading: action.value,
    };
  }),
  on(setDetailLoading, (state, action) => {
    return {
      ...state,
      detailLoading: action.value,
    };
  }),

  // get courses
  on(getCoursesSucccess, (state, action) => {
    return courseAdapter.setAll(action.coursesResponse.data, {
      ...state,
      links: action.coursesResponse.links,
      meta: action.coursesResponse.meta,
      listLoading: false,
      loaded: true,
    });
  }),
  on(getCoursesFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // add course
  on(addCourseSuccess, (state, action) => {
    return courseAdapter.addOne(action.course, {
      ...state,
      actionLoading: false,
    });
  }),
  on(addCourseFailure, (state, action) => {
    return {
      ...state,
      actionLoading: false,
      error: action.error,
    };
  }),

  // change course page
  on(changeCoursesPageSuccess, (state, action) => {
    return courseAdapter.setAll(action.coursesResponse.data, {
      ...state,
      links: action.coursesResponse.links,
      meta: action.coursesResponse.meta,
      listLoading: false,
    });
  }),
  on(changeCoursesPageFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // change course status
  on(changeCourseStatusSuccess, (state, action) => {
    return courseAdapter.setOne(action.courseResponse, {
      ...state,
      listLoading: false,
    });
  }),
  on(changeCourseStatusFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // update course
  on(updateCourseSuccess, (state, action) => {
    return courseAdapter.updateOne(
      {
        id: action.courseResponse.id,
        changes: action.courseResponse,
      },
      {
        ...state,
        actionLoading: false,
      }
    );
  }),
  on(updateCourseFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      actionLoading: false,
    };
  }),

  // load course for edit
  on(loadCourseForEditSuccess, (state, action) => ({
    ...state,
    actionLoading: false,
    selectedCourse: action.courseResponse,
  })),
  on(loadCourseForEditFailure, (state, action) => ({
    ...state,
    actionLoading: false,
    error: action.error,
  })),

  // set selected course
  on(setSelectedCourse, (state, action) => ({
    ...state,
    selectedCourse: action.selectedCourse,
  })),

  // change course status multiple
  on(changeCourseStatusMultipleSuccess, (state) => ({
    ...state,
    listLoading: false,
  })),
  on(changeCourseStatusMultipleFailure, (state, action) => ({
    ...state,
    error: action.error,
    listLoading: false,
  })),

  // change course position multiple
  on(changeCoursePositionMultipleSuccess, (state) => ({
    ...state,
    listLoading: false,
  })),
  on(changeCoursePositionMultipleFailure, (state, action) => ({
    ...state,
    listLoading: false,
    error: action.error,
  }))
);
