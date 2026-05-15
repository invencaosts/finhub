import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.boolean('is_recurring').defaultTo(false)
      table.string('frequency').nullable()
      table.date('recurrence_end_at').nullable()
      table.string('parent_id').nullable() // To group recurring instances
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('is_recurring')
      table.dropColumn('frequency')
      table.dropColumn('recurrence_end_at')
      table.dropColumn('parent_id')
    })
  }
}