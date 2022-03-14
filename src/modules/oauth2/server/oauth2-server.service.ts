import { FactoryProvider } from '@nestjs/common'

import * as ExpressOAuthServer from 'express-oauth-server'

import { OAuth2ModelService } from './oauth2-model.service'

export const OAuth2ServerProviderToken = Symbol('OAuth2ServerProviderToken')

export const OAuth2ServerFactory: FactoryProvider = {
  inject: [OAuth2ModelService],
  provide: OAuth2ServerProviderToken,
  useFactory: (oAuth2Model: OAuth2ModelService) => {
    return new ExpressOAuthServer({
      model: oAuth2Model,
      accessTokenLifetime: 2 * 3600,
      refreshTokenLifetime: 24 * 3600,
      allowEmptyState: true,
      allowExtendedTokenAttributes: true,
      useErrorHandler: true,
    })
  },
}

export class OAuth2ServerService extends ExpressOAuthServer {}
