import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('credit_cards', (table) => {
      table.string('bank_name').nullable()
    })

    this.schema.alterTable('transactions', (table) => {
      table.string('bank_name').nullable()
      table.integer('total_installments').nullable().defaultTo(1)
      table.integer('current_installment').nullable().defaultTo(1)
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL').nullable()
    })
  }

  async down() {
    this.schema.alterTable('credit_cards', (table) => {
      table.dropColumn('bank_name')
    })

    this.schema.alterTable('transactions', (table) => {
      table.dropColumn('bank_name')
      table.dropColumn('total_installments')
      table.dropColumn('current_installment')
      table.dropColumn('category_id')
    })
  }
}