import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.enum('recurrence_mode', ['fixed', 'installment']).defaultTo('installment')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('recurrence_mode')
    })
  }
}