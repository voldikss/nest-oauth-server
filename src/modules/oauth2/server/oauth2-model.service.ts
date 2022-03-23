import { Injectable } from '@nestjs/common'

import OAuth2Server from 'oauth2-server'

import { AuthHelper } from '../../auth/auth.helper'
import { User } from '../../user/user.entity'
import { UserService } from '../../user/user.service'
import { OAuth2AccessToken } from '../access-token/oauth2-access-token.entity'
import { OAuth2AccessTokenService } from '../access-token/oauth2-access-token.service'
import { OAuth2AuthorizationCode } from '../authorization-code/oauth2-authorization-code.entity'
import { OAuth2AuthorizationCodeService } from '../authorization-code/oauth2-authorization-code.service'
import { OAuth2Client } from '../client/oauth2-client.entity'
import { OAuth2ClientService } from '../client/oauth2-client.service'
import { ensureArray } from '../utils'

@Injectable()
export class OAuth2ModelService
  implements
    OAuth2Server.AuthorizationCodeModel,
    OAuth2Server.RefreshTokenModel,
    OAuth2Server.PasswordModel,
    OAuth2Server.ClientCredentialsModel
{
  constructor(
    protected readonly oAuth2AuthorizationCodeService: OAuth2AuthorizationCodeService,
    protected readonly oAuth2AccessTokenService: OAuth2AccessTokenService,
    protected readonly oAuth2ClientService: OAuth2ClientService,
    protected readonly userService: UserService,
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
    _user: User,
    client: OAuth2Client,
    scope: string[],
  ): Promise<false | 0 | string[]> {
    // NOTE: [] will pass scope validation during node-oauth2-server handle stage
    if (!client.scope) return []
    return scope.every((x) => client.scope?.includes(x)) && scope
  }

  async generateAccessToken(
    _client: OAuth2Client,
    user: User,
    _scope: string[],
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
      scope: token.scope,
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

  async verifyScope(token: OAuth2AccessToken, scope: string[]): Promise<boolean> {
    if (!token.scope) return true
    return token.scope.every((x) => ensureArray(scope).includes(x))
  }

  async getRefreshToken(
    refreshToken: string,
  ): Promise<OAuth2Server.RefreshToken | OAuth2Server.Falsey> {
    const token = await this.oAuth2AccessTokenService.searchOne({
      refreshToken,
    })
    if (!token?.refreshToken) return
    return {
      refreshToken: token?.refreshToken,
      scope: token?.scope,
      refreshTokenExpiresAt: token?.accessTokenExpiresAt,
      user: token.user,
      client: token.client,
    }
  }

  async revokeToken(
    token: OAuth2Server.RefreshToken | OAuth2Server.Token,
  ): Promise<boolean> {
    const result = await this.oAuth2AccessTokenService.delete({
      accessToken: token.accessToken,
    })
    return !!result.affected
  }

  async getUser(
    username: string,
    password: string,
  ): Promise<OAuth2Server.User | OAuth2Server.Falsey> {
    return await this.userService.login({ username, password })
  }

  async getUserFromClient({
    id: clientId,
  }: OAuth2Server.Client): Promise<OAuth2Server.User | OAuth2Server.Falsey> {
    const client = await this.oAuth2ClientService.searchOne(
      { clientId: clientId },
      undefined,
      ['user'],
    )
    return client?.user
  }
}
