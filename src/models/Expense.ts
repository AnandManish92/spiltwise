import { ExpenseType } from './ExpenseType';

export interface Expense {
  id: string;
  amount: number;
  paidBy: string; // userId
  owedBy: { [userId: string]: number};
  //notes: string;
  name: string;
  type: ExpenseType;
}