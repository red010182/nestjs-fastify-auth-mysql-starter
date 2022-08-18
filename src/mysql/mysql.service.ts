/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as mysql from 'mysql2'

// TODO: transaction

@Injectable()
export class MysqlService implements OnModuleInit {
  private pool: mysql.Pool

  constructor(private config: ConfigService) {
    this.pool = mysql.createPool({
      host: this.config.get<string>('DB_HOST'),
      user: this.config.get<string>('DB_USER'),
      password: this.config.get<string>('DB_PASSWORD'),
      port: this.config.get<number>('DB_PORT'),
      database: this.config.get<string>('DB_DATABASE'),
      charset: 'UTF8MB4_GENERAL_CI',
      connectionLimit: 32,
      multipleStatements: true,
      supportBigNumbers: true,
      dateStrings: ['DATETIME'],
      queueLimit: 0,
    })
  }

  async onModuleInit() {
    const rows = await this.query('SELECT 1')
    if (!rows) throw new Error('Database connect fail!')
    Logger.log('MySQL Database connected.')
  }

  format(qString: string, qParams: any) {
    return mysql.format(qString, qParams)
  }

  query<T>(qString: string, qParams?: any, options?: mysql.QueryOptions): Promise<T> {
    return new Promise((resolve, reject) => {
      const sql = { sql: this.format(qString, qParams) }
      this.pool.query(Object.assign(sql, options), (err, result) => {
        if (err) {
          Logger.error(sql.sql)
          reject(err)
        } else {
          resolve(result as unknown as T)
        }
      })
    })
  }
}
