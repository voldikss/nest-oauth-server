import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Redirect,
  Render,
  Res,
} from '@nestjs/common'

import { Response } from 'express'

import { Public } from '../../decorators/access.decorator'
import { Operator } from '../../decorators/operator.decorator'
import { AuthHelper } from '../auth/auth.helper'
import { AUTH_JWT_NAME, AUTH_SESSION_EXPIRES_SECONDS } from '../auth/defines'

import { UserCreateDTO, UserLoginDTO } from './user.dto'
import { User } from './user.entity'
import { UserService } from './user.service'
import { encrypt } from './utils'

@Controller('users')
export class UserController {
  constructor(
    protected readonly userService: UserService,
    protected readonly authHelper: AuthHelper,
  ) {}

  @Get()
  async list() {
    return await this.userService.searchMany({})
  }

  @Post()
  async create(@Body() input: UserCreateDTO) {
    const password = await encrypt(input.password)
    return await this.userService.createOne({ ...input, password })
  }

  @Public()
  @Get('/login')
  @Render('login')
  loginPage() {}

  @Public()
  @Post('/login')
  async login(
    @Body() input: UserLoginDTO,
    @Res() res: Response,
    @Query('redirect') redirectUrl: string,
  ) {
    const user = await this.userService.login(input)
    const token = this.authHelper.createToken(user.id)
    res.cookie(AUTH_JWT_NAME, token, {
      httpOnly: true,
      maxAge: 1000 * AUTH_SESSION_EXPIRES_SECONDS,
    })
    return res.redirect(redirectUrl || '/')
  }

  @Public()
  @Get('/register')
  @Render('register')
  registerPage() {}

  @Public()
  @Post('/register')
  @Redirect('/')
  async register(@Body() input: UserCreateDTO, @Res() res: Response) {
    const password = await encrypt(input.password)
    const user = await this.userService.createOne({ ...input, password })
    const token = this.authHelper.createToken(user.id)
    res.cookie(AUTH_JWT_NAME, token, {
      httpOnly: true,
      maxAge: 1000 * AUTH_SESSION_EXPIRES_SECONDS,
    })
  }

  @Get('/logout')
  @Redirect('/')
  logout(@Res() res: Response) {
    res.clearCookie(AUTH_JWT_NAME)
  }

  @Get('/profile')
  @Render('profile')
  async profile(@Operator() user: User) {
    return { user }
  }

  @Get('/me')
  async me(@Operator() user: User) {
    return user
  }

  @Get('/:id')
  async get(@Param('id') id: string) {
    return await this.userService.searchOne({ id })
  }
}
