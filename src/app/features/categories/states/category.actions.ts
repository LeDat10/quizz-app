import { createAction, props } from '@ngrx/store';

export const showForm = createAction(
  '[category] show form',
  props<{ value: boolean }>()
);
