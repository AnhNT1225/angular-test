import { createReducer, on } from '@ngrx/store';
import { updateBalance } from './balance.actions';

export const initialState = {
  balance: 0,
};

export const balanceReducer = createReducer(
  initialState,
  on(updateBalance, (state, { balance }) => ({ ...state, balance })),
);
