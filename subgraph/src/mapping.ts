import { ExpenseCreated as ExpenseCreatedEvent, 
         DebtorPaid as DebtorPaidEvent,
         ExpenseCancelled as ExpenseCancelledEvent } from '../generated/Split/Split'
import { ExpenseCreated, DebtorPaid, ExpenseCancelled } from '../generated/schema'

export function handleExpenseCreated(event: ExpenseCreatedEvent): void {
  let expenseCreated = new ExpenseCreated(event.logIndex.toHexString())
  expenseCreated.creator = event.params.creator
  expenseCreated.recipient = event.params.recipient
  expenseCreated.amount = event.params.amount
  expenseCreated.save()
}

export function handleDebtorPaid(event: DebtorPaidEvent): void {
  let debtorPaid = new DebtorPaid(event.logIndex.toHexString())
  debtorPaid.recipient = event.params.recipient
  debtorPaid.debtor = event.params.debtor
  debtorPaid.amount = event.params.amount
  debtorPaid.save()
}

export function handleExpenseCancelled(event: ExpenseCancelledEvent): void {
  let expenseCancelled = new ExpenseCancelled(event.logIndex.toHexString())
  expenseCancelled.creator = event.params.creator
  expenseCancelled.recipient = event.params.recipient
  expenseCancelled.amount = event.params.amount
  expenseCancelled.save()
}
