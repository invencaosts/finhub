import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'transactions'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('description').notNullable()
      table.decimal('amount', 12, 2).notNullable()
      table.enum('type', ['income', 'expense']).notNullable()
      table.string('category').notNullable()
      table.date('date').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('credit_card_id').unsigned().references('id').inTable('credit_cards').onDelete('SET NULL').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}