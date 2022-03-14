import { Injectable } from '@nestjs/common'

import { Request } from 'express'
import * as jwt from 'jsonwebtoken'

import { User } from '../user/user.entity'
import { UserService } from '../user/user.service'

import {
  AUTH_JWT_NAME,
  AUTH_JWT_SECRET,
  AUTH_SESSION_EXPIRES_SECONDS,
} from './defines'

@Injectable()
export class AuthHelper {
  constructor(protected readonly userService: UserService) {}

  async identify(req: Request) {
    const token = this.getToken(req)
    const maybeUser = this.verifyToken(token)
    if (maybeUser) {
      return await this.userService.searchOne({ id: maybeUser.id })
    }
  }

  protected getToken(req: Request) {
    let token = ''
    if (req.query?.[AUTH_JWT_NAME]) {
      token = req.query?.[AUTH_JWT_NAME] as string
    } else if (req.header(AUTH_JWT_NAME)) {
      token = req.header(AUTH_JWT_NAME) as string
    } else if (req.body?.[AUTH_JWT_NAME]) {
      token = req.body?.[AUTH_JWT_NAME]
    } else if (req.cookies?.[AUTH_JWT_NAME]) {
      token = req.cookies?.[AUTH_JWT_NAME]
    } else if (req.header('Authorization')) {
      token = req.header('Authorization')?.replace('Bearer ', '') || ''
    }
    return token
  }

  createToken(userId: string) {
    const payload = {
      id: userId,
      iat: Math.floor(new Date().getTime() / 1000),
    }
    return jwt.sign(payload, AUTH_JWT_SECRET, {
      expiresIn: AUTH_SESSION_EXPIRES_SECONDS,
    })
  }

  verifyToken(token: string) {
    try {
      return jwt.verify(token, AUTH_JWT_SECRET, {
        maxAge: AUTH_SESSION_EXPIRES_SECONDS,
      }) as User
    } catch (e) {
      return null
    }
  }
}
