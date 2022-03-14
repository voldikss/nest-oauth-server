import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AppController } from './app.controller'
import { GlobalExceptionFilter } from './exceptions/global.exception-filter'
import { AuthGuard } from './guards/auth.guard'
import { ReqPathLoggerMiddleware } from './middlewares/logger.middleware'
import { AuthModule } from './modules/auth/auth.module'
import { OAuth2Module } from './modules/oauth2/oauth2.module'
import { UserModule } from './modules/user/user.module'
import * as ormconfig from './ormconfig'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormconfig,
      autoLoadEntities: true,
    }),
    UserModule,
    OAuth2Module,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ReqPathLoggerMiddleware).forRoutes('/')
  }
}
