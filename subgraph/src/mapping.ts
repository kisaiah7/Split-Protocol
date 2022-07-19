import { ExpenseCreated as ExpenseCreatedEvent, 
         DebtorPaid as DebtorPaidEvent,
         ExpenseCancelled as ExpenseCancelledEvent,
         RecipientPaid as RecipientPaidEvent } from '../generated/Split/Split'
import { ExpenseCreated, DebtorPaid, ExpenseCancelled, RecipientPaid } from '../generated/schema'

export function handleExpenseCreated(event: ExpenseCreatedEvent): void {
  let expenseCreated = new ExpenseCreated(event.logIndex.toHexString())
  expenseCreated.index = event.params.index
  expenseCreated.category = event.params.category
  expenseCreated.status = event.params.status
  expenseCreated.name = event.params.name
  expenseCreated.description = event.params.description
  expenseCreated.amount = event.params.amount
  expenseCreated.save()
}

export function handleDebtorPaid(event: DebtorPaidEvent): void {
  let debtorPaid = new DebtorPaid(event.logIndex.toHexString())
  debtorPaid.index = event.params.index
  debtorPaid.recipient = event.params.recipient
  debtorPaid.debtor = event.params.debtor
  debtorPaid.save()
}

export function handleExpenseCancelled(event: ExpenseCancelledEvent): void {
  let expenseCancelled = new ExpenseCancelled(event.logIndex.toHexString())
  expenseCancelled.index = event.params.index
  expenseCancelled.creator = event.params.creator
  expenseCancelled.recipient = event.params.recipient

  expenseCancelled.save()
}

export function handleRecipientPaid(event: RecipientPaidEvent): void {
  let recipientPaid = new RecipientPaid(event.logIndex.toHexString())
  recipientPaid.index = event.params.index
  recipientPaid.recipient = event.params.recipient
  recipientPaid.save()
}

