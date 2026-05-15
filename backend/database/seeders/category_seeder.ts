import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Category from '#models/category'

export default class extends BaseSeeder {
  async run() {
    await Category.updateOrCreateMany('name', [
      { name: 'Alimentação', color: '#FF9500', icon: 'restaurant' },
      { name: 'Lazer', color: '#FF2D55', icon: 'sports_esports' },
      { name: 'Transporte', color: '#5856D6', icon: 'directions_car' },
      { name: 'Saúde', color: '#FF3B30', icon: 'medical_services' },
      { name: 'Educação', color: '#007AFF', icon: 'school' },
      { name: 'Assinaturas', color: '#AF52DE', icon: 'subscriptions' },
      { name: 'Essencial', color: '#34C759', icon: 'home' },
      { name: 'Investimento', color: '#32D74B', icon: 'trending_up' },
      { name: 'Trabalho', color: '#007AFF', icon: 'work' },
      { name: 'Outros', color: '#8E8E93', icon: 'more_horiz' },
    ])
  }
}