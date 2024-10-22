import { Expense } from '../models/expense';
import { ExpenseType } from '../models/ExpenseType';

class ExpenseService {
  private expenses: Expense[] = [];
  private balances: Map<string, Map<string, number>> = new Map();

  addExpense(expense: Expense) {
    this.expenses.push(expense);
    this.updateBalance(expense);
  }

  getAllExpenses(): Expense[] {
    return this.expenses;
  }

  // Method to get a summary of balances
  getBalances(): Map<string, Map<string, number>> {
    return this.balances;
  }

  updateBalance(expense: Expense){
    const {amount, paidBy, owedBy, type} = expense;
    switch(type){
      case ExpenseType.EQUAL:
        this.handleEqualSplit(expense);
        break;
      case ExpenseType.EXACT:
        this.handleExactSplit(expense);
        break;
      case ExpenseType.PERCENTAGE:
        this.handlePercentSplit(expense);
        break;
      default:
        throw new Error('Unknown split type');
    }
  }

  // Handling equal split
  private handleEqualSplit(expense: Expense) {
    const totalAmount = expense.amount;
    const participants = Object.keys(expense.owedBy);
    const splitAmount = totalAmount / participants.length;

    participants.forEach((userId) => {
      this.updateUserBalance(expense.paidBy, userId, splitAmount);
    });
  }

  // Handling exact split
  private handleExactSplit(expense: Expense) {
    Object.entries(expense.owedBy).forEach(([userId, owedAmount]) => {
      this.updateUserBalance(expense.paidBy, userId, owedAmount);
    });
  }

  // Handling percentage split
  private handlePercentSplit(expense: Expense) {
    const totalAmount = expense.amount;

    Object.entries(expense.owedBy).forEach(([userId, percentage]) => {
      const owedAmount = (totalAmount * percentage) / 100;
      this.updateUserBalance(expense.paidBy, userId, owedAmount);
    });
  }

  // Method to update balances between two users
  private updateUserBalance(payerId: string, borrowerId: string, amount: number) {
    if (payerId === borrowerId) return; // No need to update if the payer and borrower are the same

    if (!this.balances.has(borrowerId)) {
      this.balances.set(borrowerId, new Map());
    }

    if (!this.balances.has(payerId)) {
      this.balances.set(payerId, new Map());
    }

    const borrowerBalances = this.balances.get(borrowerId)!;
    const payerBalances = this.balances.get(payerId)!;

    // Update borrower's debt
    const existingBorrowerDebt = borrowerBalances.get(payerId) || 0;
    borrowerBalances.set(payerId, existingBorrowerDebt + amount);

    // Update payer's credit (negative debt)
    const existingPayerCredit = payerBalances.get(borrowerId) || 0;
    payerBalances.set(borrowerId, existingPayerCredit - amount);
  }

  showBalances() {
    const balancesArray: string[] = [];

    this.balances.forEach((borrowerBalances, borrowerId) => {
      borrowerBalances.forEach((amount, payerId) => {
        if (amount > 0) {
          balancesArray.push(`${borrowerId} owes ${payerId}: ${amount.toFixed(2)}`);
        }
      });
    });

    if (balancesArray.length === 0) {
      console.log('No balances');
    } else {
      balancesArray.forEach((balance) => console.log(balance));
    }
  }
}

export default new ExpenseService();