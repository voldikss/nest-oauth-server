import { Injectable } from '@nestjs/common'

import {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from 'express'
import { AuthorizeOptions, Request, Response, TokenOptions } from 'oauth2-server'
import * as OAuth2Server from 'oauth2-server'

import { OAuth2ModelService } from './oauth2-model.service'

@Injectable()
export class OAuth2ServerService {
  private server: OAuth2Server
  constructor(protected readonly oAuth2ModelService: OAuth2ModelService) {
    this.server = new OAuth2Server({ model: this.oAuth2ModelService })
  }

  private handleResponse(
    _req: ExpressRequest,
    res: ExpressResponse,
    response: Response,
  ) {
    if (response.status === 302 && response.headers) {
      const location = response.headers.location
      delete response.headers.location
      res.set(response.headers)
      res.redirect(location)
    } else {
      res.set(response.headers)
      if (response.status) res.status(response.status)
      res.send(response.body)
    }
  }

  authorize(options?: AuthorizeOptions) {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
      const request = new Request(req)
      const response = new Response(res)
      return this.server
        .authorize(request, response, options)
        .then(() => {
          return this.handleResponse(req, res, response)
        })
        .catch(next)
    }
  }

  token(options?: TokenOptions) {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction) => {
      const request = new Request(req)
      const response = new Response(res)
      return this.server
        .token(request, response, options)
        .then(() => {
          this.handleResponse(req, res, response)
        })
        .catch(next)
    }
  }
}
