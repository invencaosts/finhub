import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'month_periods'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('month').notNullable()
      table.integer('year').notNullable()
      table.decimal('income_goal', 12, 2).defaultTo(0)
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      
      table.unique(['month', 'year', 'user_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}