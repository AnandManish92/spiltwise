import ExpenseController from './controllers/expenseController';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on('line', (input) => {
  const args = input.split(' ');
  const command = args[0];

  switch (command) {
    case 'EXPENSE':
      ExpenseController.addExpense(args.slice(1));
      break;
    case 'SHOW':
      ExpenseController.showBalances();
      break;
    // Handle more commands here
    default:
      console.log('Unknown command');
  }
});