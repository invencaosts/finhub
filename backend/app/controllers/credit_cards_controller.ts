import CreditCard from '#models/credit_card'
import { HttpContext } from '@adonisjs/core/http'
import { createCreditCardValidator } from '#validators/credit_card'

export default class CreditCardsController {
  /**
   * List credit cards for the authenticated user
   */
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    const cards = await CreditCard.query().where('userId', user.id).orderBy('name', 'asc')
    return response.ok(cards)
  }

  /**
   * Create a new credit card
   */
  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(createCreditCardValidator)

    const card = await CreditCard.create({
      ...data,
      limit: data.limit.toString(),
      userId: user.id,
    })

    return response.created(card)
  }

  /**
   * Update a credit card
   */
  async update({ auth, params, request, response }: HttpContext) {
    const user = auth.user!
    const card = await CreditCard.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    const data = await request.validateUsing(createCreditCardValidator)
    
    card.merge({
      ...data,
      limit: data.limit.toString()
    })
    await card.save()
    
    return response.ok(card)
  }

  /**
   * Delete a credit card
   */
  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const card = await CreditCard.query()
      .where('id', params.id)
      .where('userId', user.id)
      .firstOrFail()

    await card.softDelete()
    return response.noContent()
  }
}