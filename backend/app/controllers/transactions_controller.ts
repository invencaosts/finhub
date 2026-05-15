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
    const month = parseInt(request.input('month'))
    const year = parseInt(request.input('year'))

    let query = Transaction.query().where('userId', user.id).preload('category')

    if (month && year) {
      query = query.whereRaw('EXTRACT(MONTH FROM date) = ?', [month])
                   .whereRaw('EXTRACT(YEAR FROM date) = ?', [year])
    }

    const transactions = await query.orderBy('date', 'desc')

    // Calculate Carried Over Balance (Saldo que vem dos meses anteriores)
    let carriedOverBalance = 0
    if (month && year) {
      const firstDayOfMonth = DateTime.local(year, month, 1).toSQLDate()
      
      const previousIncomes = await Transaction.query()
        .where('userId', user.id)
        .where('type', 'income')
        .where('date', '<', firstDayOfMonth!)
        .sum('amount as total')
      
      const previousExpenses = await Transaction.query()
        .where('userId', user.id)
        .where('type', 'expense')
        .where('date', '<', firstDayOfMonth!)
        .sum('amount as total')

      carriedOverBalance = (parseFloat(previousIncomes[0].$extras.total || 0)) - 
                           (parseFloat(previousExpenses[0].$extras.total || 0))
    }

    return response.ok({
      transactions,
      carriedOverBalance
    })
  }

  /**
   * Create a new transaction
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const { recurrenceEndAt, date, ...rest } = await request.validateUsing(createTransactionValidator)

    const totalInstallments = rest.totalInstallments || 1
    const rawAmount = parseFloat(rest.amount.toString())
    
    // Logic: 
    // If recurrenceMode is 'fixed' or it's an 'income', we repeat the full amount.
    // If recurrenceMode is 'installment' (default for expense), we divide the amount.
    const isFixed = rest.recurrenceMode === 'fixed' || rest.type === 'income'
    const installmentAmount = isFixed ? rawAmount : (rawAmount / totalInstallments)
    
    const startDate = DateTime.fromISO(date)
    const parsedRecurrenceEndAt = recurrenceEndAt ? DateTime.fromISO(recurrenceEndAt) : undefined

    // Create first record
    const firstTransaction = await Transaction.create({
      ...rest,
      amount: installmentAmount.toFixed(2),
      userId: user.id,
      date: startDate,
      recurrenceEndAt: parsedRecurrenceEndAt,
      currentInstallment: 1,
      totalInstallments: totalInstallments,
      recurrenceMode: rest.recurrenceMode || (rest.type === 'income' ? 'fixed' : 'installment')
    })

    // Create subsequent records
    if (totalInstallments > 1) {
      for (let i = 1; i < totalInstallments; i++) {
        await Transaction.create({
          ...rest,
          amount: installmentAmount.toFixed(2),
          userId: user.id,
          date: startDate.plus({ months: i }),
          recurrenceEndAt: parsedRecurrenceEndAt,
          currentInstallment: i + 1,
          totalInstallments: totalInstallments,
          parentId: firstTransaction.id.toString(),
          recurrenceMode: rest.recurrenceMode || (rest.type === 'income' ? 'fixed' : 'installment')
        })
      }
    }

    return response.created(firstTransaction)
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

    const { recurrenceEndAt, date, ...rest } = await request.validateUsing(createTransactionValidator)
    
    transaction.merge({
      ...rest,
      amount: rest.amount.toString(),
      date: DateTime.fromISO(date),
      recurrenceEndAt: recurrenceEndAt ? DateTime.fromISO(recurrenceEndAt) : undefined,
    })
    
    await transaction.save()
    return response.ok(transaction)
  }

  /**
   * Delete a transaction
   */
  async destroy({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const deleteAll = request.input('deleteAll') === 'true'
    
    const transaction = await Transaction.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    if (deleteAll && (transaction.parentId || (transaction.totalInstallments && transaction.totalInstallments > 1))) {
      const parentId = transaction.parentId || transaction.id.toString()
      
      // Delete parent and all children
      await Transaction.query()
        .where('userId', user.id)
        .where((q) => {
          q.where('parentId', parentId).orWhere('id', parentId)
        })
        .update({ deletedAt: DateTime.now() })
    } else {
      await transaction.softDelete()
    }

    return response.noContent()
  }
}