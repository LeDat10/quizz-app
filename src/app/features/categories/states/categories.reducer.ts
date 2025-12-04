import { createReducer, on } from '@ngrx/store';
import { categoryAdapter, initialState } from './categories.state';
import {
  addCategoryFailure,
  addCategorySuccess,
  changeCategoryPageFailure,
  changeCategoryPageSuccess,
  changeCategoryStatusFailure,
  changeCategoryStatusSuccess,
  getCategoriesFailure,
  getCategoriesSuccess,
  getCategoryDetailFailure,
  getCategoryDetailSuccess,
  loadCategoryForEditFailure,
  loadCategoryForEditSuccess,
  setActionLoading,
  setDetailLoading,
  setListLoading,
  setSelectedCategory,
  showForm,
  updateCategoryFailure,
  updateCategoryPositionMultipleSuccess,
  updateCategoryPositionMutipleFailure,
  updateCategoryStatusMutipleFailure,
  updateCategoryStatusMutipleSuccess,
  updateCategorySuccess,
} from './categories.actions';

export const categoryReducer = createReducer(
  initialState,

  // set show form
  on(showForm, (state, action) => {
    return {
      ...state,
      showForm: action.value,
    };
  }),

  // set loading value
  on(setDetailLoading, (state, action) => {
    return {
      ...state,
      detailLoading: action.value,
    };
  }),
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

  // get categories
  on(getCategoriesSuccess, (state, action) => {
    return categoryAdapter.setAll(action.response.data, {
      ...state,
      meta: action.response.meta,
      links: action.response.links,
      loaded: true,
      listLoading: false,
    });
  }),
  on(getCategoriesFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // add category
  on(addCategorySuccess, (state, action) => {
    return categoryAdapter.addOne(action.category, {
      ...state,
      actionLoading: false,
    });
  }),
  on(addCategoryFailure, (state, action) => {
    return {
      ...state,
      actionLoading: false,
      error: action.error,
    };
  }),

  // change category status
  on(changeCategoryStatusSuccess, (state, action) => {
    return categoryAdapter.updateOne(
      {
        id: action.categoryRespone.data.id,
        changes: {
          status: action.categoryRespone.data.status,
        },
      },
      {
        ...state,
        listLoading: false,
      }
    );
  }),
  on(changeCategoryStatusFailure, (state, action) => {
    return {
      ...state,
      error: action,
      listLoading: false,
    };
  }),

  // get category detail
  on(getCategoryDetailSuccess, (state, action) => {
    return {
      ...state,
      detailLoading: false,
      selectedCategory: action.category,
    };
  }),
  on(getCategoryDetailFailure, (state, action) => {
    return {
      ...state,
      detailLoading: false,
      error: action.error,
    };
  }),

  // update category
  on(updateCategorySuccess, (state, action) => {
    return categoryAdapter.updateOne(
      {
        id: action.category.id,
        changes: action.category,
      },
      {
        ...state,
        actionLoading: false,
      }
    );
  }),
  on(updateCategoryFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      actionLoading: false,
    };
  }),

  // change category page
  on(changeCategoryPageSuccess, (state, action) => {
    return categoryAdapter.setAll(action.categoryResponse.data, {
      ...state,
      listLoading: false,
      meta: action.categoryResponse.meta,
      links: action.categoryResponse.links,
    });
  }),
  on(changeCategoryPageFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // update category postion multiple
  on(updateCategoryPositionMultipleSuccess, (state, action) => {
    return {
      ...state,
      listLoading: false,
    };
  }),
  on(updateCategoryPositionMutipleFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
    };
  }),

  // update category status multiple
  on(updateCategoryStatusMutipleSuccess, (state) => {
    return {
      ...state,
      listLoading: false,
    };
  }),
  on(updateCategoryStatusMutipleFailure, (state, action) => {
    return {
      ...state,
      listLoading: false,
      error: action.error,
    };
  }),

  // load category for edit
  on(loadCategoryForEditSuccess, (state, action) => {
    return {
      ...state,
      selectedCategory: action.category,
      detailLoading: false,
    };
  }),
  on(loadCategoryForEditFailure, (state, action) => {
    return {
      ...state,
      error: action.error,
      detailLoading: false,
    };
  }),

  // selected category
  on(setSelectedCategory, (state, action) => ({
    ...state,
    selectedCategory: action.selectedCategory,
  }))
);
