import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'card_invoices'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('credit_card_id').unsigned().references('id').inTable('credit_cards').onDelete('CASCADE')
      table.integer('month').notNullable()
      table.integer('year').notNullable()
      table.decimal('value', 12, 2).notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      
      table.unique(['credit_card_id', 'month', 'year'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}