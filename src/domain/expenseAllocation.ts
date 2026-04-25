import type { ExpenseAllocationDTO } from './expenseAllocationDTO'

export class ExpenseAllocation {
    constructor(
        public participantId = 0,
        public total = 0
    ) { }

    toDTO(): ExpenseAllocationDTO {
        return {
            participantId: this.participantId,
            total: this.total
        }
    }
}