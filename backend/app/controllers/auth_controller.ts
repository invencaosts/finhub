import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, auth, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    await auth.use('web').login(user)

    return response.created({
      user,
    })
  }

  /**
   * Login a user
   */
  async login({ request, auth, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    
    const user = await User.verifyCredentials(email, password)
    await auth.use('web').login(user)

    return response.ok({
      user,
    })
  }

  /**
   * Get the current user
   */
  async me({ auth, response }: HttpContext) {
    return response.ok(auth.user)
  }

  /**
   * Logout a user
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.ok({ message: 'Logged out successfully' })
  }

  /**
   * Update user profile
   */
  async updateProfile({ auth, request, response }: HttpContext) {
    const user = auth.user!
    const data = request.only(['fullName', 'email', 'password'])

    if (data.fullName) user.fullName = data.fullName
    if (data.email) user.email = data.email
    if (data.password) user.password = data.password

    await user.save()
    return response.ok(user)
  }
}