import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'

import { OAuth2AccessToken } from './access-token/oauth2-access-token.entity'
import { OAuth2AccessTokenService } from './access-token/oauth2-access-token.service'
import { OAuth2AuthorizationCode } from './authorization-code/oauth2-authorization-code.entity'
import { OAuth2AuthorizationCodeService } from './authorization-code/oauth2-authorization-code.service'
import { OAuth2Client } from './client/oauth2-client.entity'
import { OAuth2ClientService } from './client/oauth2-client.service'
import { OAuth2Controller } from './oauth2.controller'
import { OAuth2ModelService } from './server/oauth2-model.service'
import { OAuth2ServerFactory } from './server/oauth2-server.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OAuth2AccessToken,
      OAuth2AuthorizationCode,
      OAuth2Client,
    ]),
    AuthModule,
    UserModule,
  ],
  providers: [
    OAuth2AccessTokenService,
    OAuth2AuthorizationCodeService,
    OAuth2ClientService,
    OAuth2ModelService,
    OAuth2ServerFactory,
  ],
  controllers: [OAuth2Controller],
})
export class OAuth2Module {}
