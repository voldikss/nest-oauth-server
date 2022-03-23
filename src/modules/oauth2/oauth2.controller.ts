import {
  Body,
  Controller,
  Get,
  Inject,
  Next,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common'

import { NextFunction, Request, Response } from 'express'

import { Public } from '../../decorators/access.decorator'
import { Operator } from '../../decorators/operator.decorator'
import { User } from '../user/user.entity'

import { OAuth2ClientCreateDTO } from './client/oauth2-client.dto'
import { OAuth2ClientService } from './client/oauth2-client.service'
import {
  OAuth2ServerProviderToken,
  OAuth2ServerService,
} from './server/oauth2-server.service'
import { generateRandomToken } from './utils'

@Controller('oauth2')
export class OAuth2Controller {
  constructor(
    @Inject(OAuth2ServerProviderToken)
    protected readonly oAuth2ServerService: OAuth2ServerService,
    protected readonly oAuth2ClientService: OAuth2ClientService,
  ) {}

  @Get('/')
  @Redirect('/oauth2/clients')
  oauth2() {}

  @Get('/authorize')
  async authorize(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
    @Operator() user: User,
  ) {
    return this.oAuth2ServerService.authorize({
      allowEmptyState: true,
      authenticateHandler: {
        handle: () => user,
      },
    })(req, res, next)
  }

  @Public()
  @Post('/token')
  async token(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    return this.oAuth2ServerService.token()(req, res, next)
  }

  @Get('/clients')
  @Render('list-clients')
  async pageListClients(@Operator() user: User) {
    const clients = await this.oAuth2ClientService.searchMany({ user })
    return { clients }
  }

  @Get('/client')
  @Render('create-client')
  pageCreateClient() {}

  @Post('/client')
  async actionCreateClient(@Body() input: OAuth2ClientCreateDTO) {
    return await this.oAuth2ClientService.createOne({
      name: input.name,
      clientId: await generateRandomToken(),
      clientSecret: await generateRandomToken(),
      grants: input.grants,
      redirectUris: input.redirectUris,
      scope: input.scope,
    })
  }
}
