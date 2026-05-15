import { CreditCardSchema } from '#database/schema'
import { beforeFind, beforeFetch } from '@adonisjs/lucid/orm'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'

export default class CreditCard extends CreditCardSchema {
  @beforeFind()
  @beforeFetch()
  static ignoreDeleted(query: ModelQueryBuilderContract<typeof CreditCard>) {
    query.whereNull('deleted_at')
  }

  async softDelete() {
    this.deletedAt = DateTime.now()
    await this.save()
  }
}
