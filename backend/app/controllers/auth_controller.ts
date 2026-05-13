import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'
import { registerValidator, loginValidator } from '#validators/auth'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)
    const user = await User.create(data)

    const token = await User.accessTokens.create(user)

    return response.created({
      user,
      token: token.value!.release(),
    })
  }

  /**
   * Login a user
   */
  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)
    
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user,
      token: token.value!.release(),
    })
  }

  /**
   * Get the current user
   */
  async me({ auth, response }: HttpContext) {
    await auth.check()
    return response.ok(auth.user)
  }

  /**
   * Logout a user
   */
  async logout({ auth, response }: HttpContext) {
    const user = auth.user!
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
    return response.ok({ message: 'Logged out successfully' })
  }
}