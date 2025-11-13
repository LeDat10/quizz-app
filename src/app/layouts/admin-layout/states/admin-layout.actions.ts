import { createAction, props } from '@ngrx/store';

export const showSidebar = createAction(
  '[admin-layout] show sidebar',
  props<{ value: boolean }>()
);
