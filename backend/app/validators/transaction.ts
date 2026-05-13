import vine from '@vinejs/vine'

export const createTransactionValidator = vine.compile(
  vine.object({
    description: vine.string().trim().minLength(3),
    amount: vine.number().positive(),
    type: vine.enum(['income', 'expense']),
    date: vine.string(),
    creditCardId: vine.number().optional(),
    bankName: vine.string().trim().optional(),
    totalInstallments: vine.number().min(1).optional(),
    currentInstallment: vine.number().min(1).optional(),
    categoryId: vine.number().optional(),
  })
)