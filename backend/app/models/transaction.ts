import { TransactionSchema } from '#database/schema'
import Category from '#models/category'
import { belongsTo, column, beforeFind, beforeFetch } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class Transaction extends TransactionSchema {
  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @column()
  declare recurrenceMode: 'fixed' | 'installment'

  @beforeFind()
  @beforeFetch()
  static ignoreDeleted(query: ModelQueryBuilderContract<typeof Transaction>) {
    query.whereNull('deleted_at')
  }

  async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }
}
