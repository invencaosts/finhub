import vine from '@vinejs/vine'

export const createCreditCardValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    limit: vine.number().positive(),
    dueDay: vine.number().min(1).max(31),
    bankName: vine.string().trim().optional(),
  })
)