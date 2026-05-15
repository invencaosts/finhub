/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
    updateProfile: typeof routes['auth.update_profile']
  }
  transactions: {
    index: typeof routes['transactions.index']
    store: typeof routes['transactions.store']
    show: typeof routes['transactions.show']
    update: typeof routes['transactions.update']
    destroy: typeof routes['transactions.destroy']
  }
  creditCards: {
    index: typeof routes['credit_cards.index']
    store: typeof routes['credit_cards.store']
    show: typeof routes['credit_cards.show']
    update: typeof routes['credit_cards.update']
    destroy: typeof routes['credit_cards.destroy']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    show: typeof routes['categories.show']
    update: typeof routes['categories.update']
    destroy: typeof routes['categories.destroy']
  }
}
