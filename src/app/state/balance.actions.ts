import { createAction, props } from '@ngrx/store';

export const updateBalance = createAction(
  '[Balance] Update Balance',
  props<{ balance: number }>(),
);
