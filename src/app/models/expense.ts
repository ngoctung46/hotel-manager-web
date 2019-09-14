import { ExpenseType } from '../enums';

export interface Expense {
  expenseId?: string;
  name: string;
  amount: number;
  type: ExpenseType;
  createdAt?: any;
}
