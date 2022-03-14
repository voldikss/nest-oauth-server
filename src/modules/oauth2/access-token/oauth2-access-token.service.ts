import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { Repository } from 'typeorm'

import { BaseService } from '../../base/base.service'

import {
  OAuth2AccessToken,
  OAuth2AccessTokenPopulateSpec,
} from './oauth2-access-token.entity'

@Injectable()
export class OAuth2AccessTokenService extends BaseService<
  OAuth2AccessToken,
  OAuth2AccessTokenPopulateSpec
> {
  constructor(
    @InjectRepository(OAuth2AccessToken)
    protected readonly repository: Repository<OAuth2AccessToken>,
  ) {
    super()
  }
}
