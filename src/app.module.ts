import { MiddlewareConsumer, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { APP_FILTER, APP_INTERCEPTOR, APP_GUARD } from '@nestjs/core'
import { ErrorFilter } from './global/error.filter'
import { LoggingInterceptor } from './global/logging.interceptor'
import { AuthModule } from './auth/auth.module'
import { RolesGuard } from './auth/roles.guard'
import { MysqlModule } from './mysql/mysql.module'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { JwtMiddleware } from './auth/jwt.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // TODO: developement.env, staging.env, production.env
      envFilePath: ['.env'],
    }),
    MysqlModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*')
  }
}
