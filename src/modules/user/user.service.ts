import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { omit } from 'lodash'
import { Repository } from 'typeorm'

import { BaseService } from '../base/base.service'

import { UserCreateDTO, UserLoginDTO } from './user.dto'
import { User, UserPopulateSpec } from './user.entity'
import { verify } from './utils'

@Injectable()
export class UserService extends BaseService<User, UserPopulateSpec> {
  constructor(@InjectRepository(User) protected repository: Repository<User>) {
    super()
  }

  async create(input: UserCreateDTO) {
    return await this.createOne(input)
  }

  async login(input: UserLoginDTO) {
    const user = await this.searchOne({ username: input.username }, [
      'password',
      'id',
    ])
    if (!user) {
      throw new UnauthorizedException()
    }
    if (!(await verify(input.password, user.password))) {
      throw new UnauthorizedException()
    }
    return omit(user, ['password'])
  }
}
