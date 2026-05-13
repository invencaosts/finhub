import Transaction from '#models/transaction'
import { HttpContext } from '@adonisjs/core/http'
import { createTransactionValidator } from '#validators/transaction'
import { DateTime } from 'luxon'

export default class TransactionsController {
  /**
   * List transactions for the authenticated user
   */
  async index({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const month = request.input('month')
    const year = request.input('year')

    let query = Transaction.query().where('userId', user.id).preload('category')

    if (month && year) {
      query = query.whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
                   .whereRaw('EXTRACT(YEAR FROM date) = ?', [year])
    }

    const transactions = await query.orderBy('date', 'desc')
    return response.ok(transactions)
  }

  /**
   * Create a new transaction
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createTransactionValidator)

    const transaction = await Transaction.create({
      ...data,
      amount: data.amount.toString(),
      userId: user.id,
      date: DateTime.fromISO(data.date),
    })

    return response.created(transaction)
  }

  /**
   * Update a transaction
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(createTransactionValidator)
    
    transaction.merge({
      ...data,
      amount: data.amount.toString(),
      date: DateTime.fromISO(data.date),
    })
    
    await transaction.save()
    return response.ok(transaction)
  }

  /**
   * Delete a transaction
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await transaction.delete()
    return response.noContent()
  }
}