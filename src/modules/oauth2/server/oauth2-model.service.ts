import { Injectable } from '@nestjs/common'

import OAuth2Server from 'oauth2-server'

import { AuthHelper } from '../../auth/auth.helper'
import { User } from '../../user/user.entity'
import { OAuth2AccessToken } from '../access-token/oauth2-access-token.entity'
import { OAuth2AccessTokenService } from '../access-token/oauth2-access-token.service'
import { OAuth2AuthorizationCode } from '../authorization-code/oauth2-authorization-code.entity'
import { OAuth2AuthorizationCodeService } from '../authorization-code/oauth2-authorization-code.service'
import { OAuth2Client } from '../client/oauth2-client.entity'
import { OAuth2ClientService } from '../client/oauth2-client.service'
import { ensureArray } from '../utils'

@Injectable()
export class OAuth2ModelService implements OAuth2Server.AuthorizationCodeModel {
  constructor(
    protected readonly oAuth2AuthorizationCodeService: OAuth2AuthorizationCodeService,
    protected readonly oAuth2AccessTokenService: OAuth2AccessTokenService,
    protected readonly oAuth2ClientService: OAuth2ClientService,
    protected readonly authHelper: AuthHelper,
  ) {}

  async getAuthorizationCode(
    authorizationCode: string,
  ): Promise<OAuth2AuthorizationCode | OAuth2Server.Falsey> {
    return await this.oAuth2AuthorizationCodeService.searchOne(
      {
        authorizationCode,
      },
      undefined,
      ['client', 'user'],
    )
  }

  async saveAuthorizationCode(
    code: Pick<
      OAuth2AuthorizationCode,
      'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'
    >,
    client: OAuth2Client,
    user: User,
  ): Promise<OAuth2AuthorizationCode | OAuth2Server.Falsey> {
    return await this.oAuth2AuthorizationCodeService.createOne({
      user,
      client,
      scope: ensureArray(code.scope),
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      authorizationCode: code.authorizationCode,
    })
  }

  async revokeAuthorizationCode(code: OAuth2AuthorizationCode): Promise<boolean> {
    const result = await this.oAuth2AuthorizationCodeService.delete({
      id: code.id,
    })
    return !!result.affected
  }

  async validateScope(
    user: User,
    client: OAuth2Client,
    scope: string | string[],
  ): Promise<string | false | 0 | string[]> {
    // TODO
    return scope
  }

  async generateAccessToken(
    _client: OAuth2Client,
    user: User,
    _scope: string | string[],
  ): Promise<string> {
    return this.authHelper.createToken(user.id)
  }

  async getClient(
    clientId: string,
    clientSecret: string,
  ): Promise<OAuth2Client | OAuth2Server.Falsey> {
    return await this.oAuth2ClientService.searchOne(
      {
        clientId,
        ...(clientSecret ? { clientSecret } : undefined),
      },
      undefined,
      ['user'],
    )
  }

  async saveToken(
    token: OAuth2AccessToken,
    client: OAuth2Client,
    user: User,
  ): Promise<OAuth2Server.Falsey | OAuth2AccessToken> {
    return await this.oAuth2AccessTokenService.createOne({
      user,
      client,
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    })
  }

  async getAccessToken(
    accessToken: string,
  ): Promise<OAuth2Server.Falsey | OAuth2AccessToken> {
    return await this.oAuth2AccessTokenService.searchOne(
      {
        accessToken,
      },
      undefined,
      ['user', 'client'],
    )
  }

  async verifyScope(
    token: OAuth2AccessToken,
    scope: string | string[],
  ): Promise<boolean> {
    /// TODO
    return true
  }
}
