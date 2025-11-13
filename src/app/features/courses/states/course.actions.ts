import { createAction, props } from '@ngrx/store';

export const showForm = createAction(
  '[course] show form',
  props<{ value: boolean }>()
);
