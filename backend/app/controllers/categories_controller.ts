import Category from '#models/category'
import { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'

const categoryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    color: vine.string().optional(),
    icon: vine.string().optional(),
  })
)

export default class CategoriesController {
  async index({ auth, response }: HttpContext) {
    const user = auth.user!
    // Get default categories (user_id is null) AND user specific categories
    const categories = await Category.query()
      .whereNull('userId')
      .orWhere('userId', user.id)
      .orderBy('name', 'asc')
    
    return response.ok(categories)
  }

  async store({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = await request.validateUsing(categoryValidator)

    const category = await Category.create({
      ...data,
      userId: user.id,
    })

    return response.created(category)
  }

  async destroy({ auth, params, response }: HttpContext) {
    const user = auth.user!
    const category = await Category.query()
      .where('id', params.id)
      .where('userId', user.id) // Only allow deleting own categories
      .firstOrFail()

    await category.delete()
    return response.noContent()
  }
}