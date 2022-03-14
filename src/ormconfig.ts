import * as config from 'config'
import * as path from 'path'
import { ConnectionOptions } from 'typeorm'

const database = path.join(config.get('storageDir'), 'db')

const options: ConnectionOptions = {
  type: 'sqlite',
  database,
  synchronize: false,
  migrationsRun: true,
  logging: true,
  logger: 'file',
  migrations: [`${__dirname}/migrations/*.{ts,js}`],
  cli: {
    migrationsDir: `${__dirname}/migrations`,
  },
}

export = options
