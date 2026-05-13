/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const TransactionsController = () => import('#controllers/transactions_controller')
const CreditCardsController = () => import('#controllers/credit_cards_controller')
const CategoriesController = () => import('#controllers/categories_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    // Auth Routes
    router.group(() => {
      router.post('register', [AuthController, 'register'])
      router.post('login', [AuthController, 'login'])
      router.get('me', [AuthController, 'me']).use(middleware.auth())
      router.post('logout', [AuthController, 'logout']).use(middleware.auth())
    }).prefix('auth')

    // Finance Routes
    router.group(() => {
      router.resource('transactions', TransactionsController).apiOnly()
      router.resource('credit-cards', CreditCardsController).apiOnly()
      router.resource('categories', CategoriesController).apiOnly()
    }).use(middleware.auth())

  })
  .prefix('/api/v1')
