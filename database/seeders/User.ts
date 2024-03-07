import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'admin@gmail.com',
        password: '123456789',
        it_is_active: true,
        it_is_verified: true,
        rol_id: 1
      },
      {
        email: 'viewer@gmail.com',
        password: '123456789',
        it_is_active: true,
        it_is_verified: false,
        rol_id: 2
      }
      ])
  }
}
