import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  async up() {
    this.schema.alterTable('transactions', (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
    this.schema.alterTable('credit_cards', (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
    this.schema.alterTable('categories', (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
    this.schema.alterTable('card_invoices', (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
    this.schema.alterTable('month_periods', (table) => {
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })
  }

  async down() {
    this.schema.alterTable('transactions', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.alterTable('credit_cards', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.alterTable('categories', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.alterTable('card_invoices', (table) => {
      table.dropColumn('deleted_at')
    })
    this.schema.alterTable('month_periods', (table) => {
      table.dropColumn('deleted_at')
    })
  }
}
