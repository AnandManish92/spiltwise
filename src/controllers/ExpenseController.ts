import ExpenseService from '../services/expenseService';
import { Expense } from '../models/expense';
import { ExpenseType } from '../models/ExpenseType';


class ExpenseController {
  addExpense(params: string[]) {
    // Parse the command parameters (assume a format for simplicity)
    const [paidBy, amount, type, ...owedData] = params;
    const amountNum = parseFloat(amount);

    const owedBy: { [userId: string]: number } = {};
    if (type === ExpenseType.EQUAL) {
      const participants = owedData;
      participants.forEach((userId) => {
        owedBy[userId] = 0; // Will be calculated later
      });
    } else {
      for (let i = 0; i < owedData.length; i += 2) {
        const userId = owedData[i];
        const value = parseFloat(owedData[i + 1]);
        owedBy[userId] = value;
      }
    }

    const expense: Expense = {
      id: `${Date.now()}`, // Simple unique ID
      amount: amountNum,
      paidBy,
      owedBy,
      name: 'Some expense',
      type: type as ExpenseType,
    };

    ExpenseService.addExpense(expense);
  }

  showBalances() {
    ExpenseService.showBalances();
  }
}

export default new ExpenseController();