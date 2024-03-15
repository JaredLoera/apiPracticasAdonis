import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class AppProvider {
  constructor (protected app: ApplicationContract) {
  }

  public register () {
    // Register your own bindings
  }

  public async boot () {
    const {
      ModelQueryBuilder
    } = this.app.container.use('Adonis/Lucid/Database')
    
    ModelQueryBuilder.macro('getCount', async function () {
      const result = await this.count('* as total')
      return Number(result[0].$extras.total)
    })
   
  }

  public async ready () {
    if (this.app.environment === 'web') {
      await import('../start/socket')
     }
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
 
}
