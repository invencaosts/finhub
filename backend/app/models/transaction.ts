import { TransactionSchema } from '#database/schema'
import Category from '#models/category'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Transaction extends TransactionSchema {
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>
}
